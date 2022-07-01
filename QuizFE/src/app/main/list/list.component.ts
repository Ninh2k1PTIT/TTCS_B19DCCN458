import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../models/user';
import { ListService } from './list.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  public data: User[] = [];
  public titleForm: any;
  public userDialog: boolean = false;
  public submitted: boolean = false;
  public selectedUsers: any;
  public newUserForm!: FormGroup;
  public roles: any[] = [
    {
      id: 1,
      key: ['user'],
      name: 'Người dùng',
    },
    {
      id: 2,
      key: ['admin', 'user'],
      name: 'Quản trị viên',
    },
  ];
  public exportColumns: any[] = [];
  public sizeOption: any[] = [5, 10, 20, 50];
  public size = 5;
  public displayBasic = false;

  constructor(
    private _listService: ListService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getUserList();
  }

  /**Lấy danh sách */
  getUserList() {
    this._listService.getUserList().subscribe((res: User[]) => {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      this.data = res.filter((user) => user.id != currentUser.id);
    });
  }

  /**Tạo đơn */
  openNew() {
    this.titleForm = 'Tạo người dùng mới';
    this.submitted = false;
    this.userDialog = true;
    this.newUserForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        dob: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  saveUser() {
    this.submitted = true;
    if (this.newUserForm.valid) {
      const body: User = {
        username: this.newUserForm.value.username,
        password: this.newUserForm.value.password,
        fullName: this.newUserForm.value.fullName,
        dob: this.newUserForm.value.dob,
        email: this.newUserForm.value.email,
        roles: ["user"],
        id: 0
      }
      if (this.titleForm === 'Tạo người dùng mới') {
        this._listService
          .creatUser(body)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã tạo người dùng mới',
              life: 4000,
            });
            this.getUserList();
            this.hideDialog();
          });
      } else {
        this._listService
          .updateUser(this.newUserForm.value)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật người dùng',
              life: 4000,
            });
            this.getUserList();
            this.hideDialog();
          });
      }
    }
  }

  /**Xóa */
  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tài khoản ' + user.fullName + '?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._listService.deleteUser(user.id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa người dùng',
            life: 5000,
          });
          this.getUserList();
        });
      },
    });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa ${this.selectedUsers.length} người dùng đã chọn không?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let user of this.selectedUsers) {
          this._listService.deleteUser(user.id).subscribe(() => {
            this.getUserList();
          });
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã xóa ${this.selectedUsers.length} người dùng`,
          life: 3000,
        });
        this.selectedUsers = null;
      },
    });
  }

  /**Sửa */
  editUser(user: User) {
    this.titleForm = 'Chỉnh sửa thông tin';
    this.submitted = false;
    this.userDialog = true;
    this.newUserForm = this.fb.group(
      {
        fullName: [user.fullName, Validators.required],
        dob: [new Date(user.dob), Validators.required],
        email: [user.email, Validators.required],
        username: [user.username, Validators.required],
        password: [user.password, Validators.required],
        roles: [user.roles, Validators.required],
        confirmPassword: [user.password, Validators.required],
        id: user.id,
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  /**Nhập danh sách (tạo nhiều)*/
  openImport() {
    this.displayBasic = true;
  }

  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    let fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const binaryString: String = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
        type: 'binary',
      });

      const wsname: string = workbook.SheetNames[0];
      const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

      /* save data */
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      /* post data*/
      let success = 0,
        error = 0;
      for (let i = 1; i < data.length; i++) {
        let row: any = {};
        for (let j = 0; j < data[i].length; j++) {
          row[data[0][j]] = data[i][j];
        }
        this.newUserForm = this.fb.group({
          fullName: [row.fullName, Validators.required],
          dob: [new Date(row.dob), Validators.required],
          email: [row.email, [Validators.required, Validators.email]],
          roles: [['user']],
          username: [row.username, [Validators.required]],
          password: [row.password, [Validators.required]],
        });
        
        if (this.newUserForm.valid) {
          this._listService.creatUser(row).subscribe((res) => {
            this.getUserList();
          });
          success += 1;
        } else {
          error += 1;
        }
      }
      if (success > 0)
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã tạo ${success} người dùng mới`,
          life: 4000,
        });
      if (error > 0)
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: `Không thể tạo ${error} người dùng do thông tin không hợp lệ`,
          life: 4000,
        });
      this.getUserList();
      this.displayBasic = false;
    };
    fileReader.readAsBinaryString(target.files[0]);
  }

  dowloadTemplate() {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        fullName: '',
        dob: '',
        email: '',
        username: '',
        password: '',
      },
    ]);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Mẫu danh sách');
  }

  /**Xuất danh sách */
  exportExcel() {
    this._listService.getUserList().subscribe((res: User[]) => {
      const worksheet = XLSX.utils.json_to_sheet(res);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Danh sách người dùng');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  get f() {
    return this.newUserForm.controls;
  }
}

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ ConfirmPassword: true });
      return true;
    } else {
      return null;
    }
  }
}

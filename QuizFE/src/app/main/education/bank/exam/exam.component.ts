import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Exam, Question } from 'src/app/models/question';
import * as XLSX from 'xlsx';
import { ExamService } from './exam.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  public data: Exam[] = [];
  public titleForm: any;
  public productDialog: boolean = false;
  public submitted: boolean = false;
  public selectedExam: any;
  public newQuestionForm = new FormGroup({});
  public exportColumns: any[] = [];
  public sizeOption: any[] = [5, 10, 20, 50];
  public size = 5;
  public displayBasic = false;
  public status = [{name: 'Có', value: true}, {name: 'Không', value: false}]

  constructor(
    private _examService: ExamService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getQuestionList();
  }

  getQuestionList() {
    this._examService.getExamList().subscribe((res: Exam[]) => {
      this.data = res;
    });
  }

  openNew() {
    this.titleForm = 'Tạo câu hỏi mới';
    this.submitted = false;
    this.productDialog = true;
    this.newQuestionForm = this.fb.group({
      content: [null, Validators.required],
      options: this.fb.array([]),
    });
  }

  deleteselectedExam() {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa ${this.selectedExam.length} đề thi đã chọn không?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let Question of this.selectedExam) {
          this._examService.deleteExam(Question.id).subscribe(() => {
            this.getQuestionList();
          });
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã xóa ${this.selectedExam.length} đề thi`,
          life: 3000,
        });
        this.selectedExam = null;
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  addOption() {
    this.options.push(this.fb.group({ content: null, isCorrect: 'false' }));
  }

  deleteQuestion(Question: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đề thi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._examService.deleteExam(Question.id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa đề thi',
            life: 5000,
          });
          this.getQuestionList();
        });
      },
    });
  }

  exportExcel() {
    this._examService.getExamList().subscribe((res: Exam[]) => {
      const worksheet = XLSX.utils.json_to_sheet(res);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Danh sách câu hỏi');
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
      const data: string[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      /* post data*/
      let success = 0,  error = 0;
      for (let i = 0; i < data.length; i++) {
        let row: Question = {
          content: '',
          options: [],
          id: 0,
        };
        this.newQuestionForm = this.fb.group({
          content: [
            row.content,
            [Validators.required, Validators.pattern(/.*[^ ].*$/)],
          ],
          options: [row.options, Validators.required],
        });
        const firstCol = data[i][0], lastCol = data[i][data[i].length - 1], len = data[i].length
        row.content = firstCol;
        for (let j = 1; j < len - 1; j++) {
          if (!data[i][j].toString().match(/^\s+$/))
            row.options.push({
              content: data[i][j],
              isCorrect: false,
              count: 0,
            });
        }
        if (lastCol != null && len > 1) {
          lastCol
            .toString()
            .split(',')
            .map((x) => {
              if (typeof parseInt(x) == 'number')
                row.options[parseInt(x)].isCorrect = true;
            });
        }
        if (this.newQuestionForm.valid) {
          this._examService
            .createExam(this.newQuestionForm.value)
            .subscribe((res) => {
              this.getQuestionList();
            });
          success += 1;
        } else {
          error += 1;
        }
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: `Đã tạo ${success} câu hỏi mới`,
        life: 2000,
      });

      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: `Không thể tạo ${error} câu hỏi do sai định dạng`,
        life: 2000,
      });
      this.getQuestionList();
      this.displayBasic = false;
    };
    fileReader.readAsBinaryString(target.files[0]);
  }

  openImport() {
    this.displayBasic = true;
  }

  dowloadTemplate() {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: '',
        gender: '',
        dob: '',
        citizenIdentity: '',
        phoneNo: '',
        email: '',
      },
    ]);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Mẫu danh sách');
  }

  get f() {
    return this.newQuestionForm.controls;
  }

  get options(): FormArray {
    return this.newQuestionForm.get('options') as FormArray;
  }

  trackByFn(index: any, row: any) {
    return index;
  }

  onRowEditInit(i: number) {
    this.options.removeAt(i);
  }
}

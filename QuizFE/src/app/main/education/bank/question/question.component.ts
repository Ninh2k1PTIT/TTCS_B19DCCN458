import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { QuestionService } from './question.service';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public data: Question[] = [];
  public titleForm: any;
  public productDialog: boolean = false;
  public submitted: boolean = false;
  public selectedQuestions: any;
  public newQuestionForm = new FormGroup({});
  public exportColumns: any[] = [];
  public sizeOption: any[] = [5, 10, 20, 50];
  public size = 5;
  public displayBasic = false;

  constructor(
    private _questionService: QuestionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getQuestionList();
  }

  getQuestionList() {
    this._questionService.getQuestionList().subscribe((res: Question[]) => {
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

  deleteSelectedQuestions() {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa ${this.selectedQuestions.length} câu hỏi đã chọn không?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let Question of this.selectedQuestions) {
          this._questionService.deleteQuestion(Question.id).subscribe(() => {
            this.getQuestionList();
          });
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã xóa ${this.selectedQuestions.length} câu hỏi`,
          life: 3000,
        });
        this.selectedQuestions = null;
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveQuestion() {
    this.submitted = true;
    if (this.newQuestionForm.valid) {
      if (this.titleForm === 'Tạo câu hỏi mới') {
        this._questionService
          .createQuestion(this.newQuestionForm.value)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã tạo câu hỏi mới',
              life: 4000,
            });
            this.getQuestionList();
            this.hideDialog();
          });
      } else {
        this._questionService
          .updateQuestion(this.newQuestionForm.value)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật câu hỏi',
              life: 4000,
            });
            this.getQuestionList();
            this.hideDialog();
          });
      }
    }
  }

  addOption() {
    this.options.push(this.fb.group({ content: null, isCorrect: 'false' }));
  }

  editQuestion(question: Question) {
    this.titleForm = 'Chỉnh sửa câu hỏi';
    this.submitted = false;
    this.productDialog = true;
    this.newQuestionForm = this.fb.group({
      content: [question.content, Validators.required],
      options: this.fb.array([]),
      id: question.id,
    });
    question.options.forEach((item) => {
      this.options.push(this.fb.group(item));
    });
  }

  deleteQuestion(Question: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa câu hỏi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._questionService.deleteQuestion(Question.id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa câu hỏi',
            life: 5000,
          });
          this.getQuestionList();
        });
      },
    });
  }

  exportExcel() {
    this._questionService.getQuestionList().subscribe((res: Question[]) => {
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
      let success = 0,
        error = 0;
      for (let i = 0; i < data.length; i++) {
        let row: Question = {
          content: '',
          options: [],
          id: 0,
        };
        const firstCol = data[i][0],
          lastCol = data[i][data[i].length - 1],
          len = data[i].length;
        row.content = firstCol;
        this.newQuestionForm = this.fb.group({
          content: [
            row.content,
            [Validators.required, Validators.pattern(/.*[^ ].*$/)],
          ],
          options: [row.options],
        });
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
        if (
          this.newQuestionForm.valid &&
          this.newQuestionForm.value.options.length > 0
        ) {
          this._questionService
            .createQuestion(this.newQuestionForm.value)
            .subscribe((res) => {
              this.getQuestionList();
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
          detail: `Đã tạo ${success} câu hỏi mới`,
          life: 2000,
        });
      if (error > 0)
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

  deleteOption(i: number) {
    this.options.removeAt(i);
  }
}

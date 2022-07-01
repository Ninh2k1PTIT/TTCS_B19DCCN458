import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { QuestionService } from '../../question/question.service';
import { ExamService } from '../exam.service';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss'],
})
export class EditExamComponent implements OnInit {
  public examForm = new FormGroup({});
  public status = [
    { name: 'Có', value: true },
    { name: 'Không', value: false },
  ];
  public sizeOption: any[] = [5, 10, 20, 50];
  public size = 5;
  public idExam!: number;
  public submitted: boolean = false;
  public dialog = false;
  public selectedQuestions: any[] = [];
  public questionBank: Question[] = [];
  public newQuestionList: Question[] = [];
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _examService: ExamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.idExam = this._route.snapshot.params['id'];
    this.examForm = this.fb.group({
      name: [null, Validators.required],
      time: [null, Validators.required],
      isActive: [true, Validators.required],
      questions: this.fb.array([]),
      id: [],
    });
    if (this.idExam) {
      this._examService.getExamDetail(this.idExam).subscribe((res) => {
        this.examForm.patchValue(res);
        res.questions.forEach((item) => {
          this.questions.push(
            this.fb.group({
              id: item.id,
              content: item.content,
              options: this.fb.array(item.options),
            })
          );
        });
      });
    }
  }

  get f() {
    return this.examForm.controls;
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  saveExam() {
    this.submitted = true;
    if (this.examForm.valid) {
      if (this.idExam) {
        this._examService.updateExam(this.examForm.value).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã cập nhật đề thi`,
            life: 2500,
          });
        });
      } else {
        this._examService.createExam(this.examForm.value).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã tạo đề thi mới`,
            life: 2500,
          });
        });
      }
      setTimeout(() => {
        this._router.navigateByUrl('/exam');
      }, 500);
    }
  }

  deleteQuestion(i: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa câu hỏi?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.questions.removeAt(i);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa câu hỏi',
          life: 2500,
        });
      },
    });
  }

  deleteSelectedQuestions() {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa ${this.selectedQuestions.length} câu hỏi đã chọn không?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedQuestions.forEach((question) => {
          this.questions.removeAt(
            this.questions.value.findIndex(
              (item: any) => item.id == question.id
            )
          );
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã xóa ${this.selectedQuestions.length} câu hỏi`,
          life: 2500,
        });
        this.selectedQuestions = [];
      },
    });
  }

  openAddQuestionsDialog() {
    this.dialog = true;
    this.newQuestionList = [];
    this._questionService.getQuestionList().subscribe((res) => {
      this.questionBank = res;
    });
  }

  hideDialog() {
    this.dialog = false;
  }

  saveQuestion() {
    let success = 0,
      error = 0;
    this.newQuestionList.forEach((item: any) => {
      if (
        this.questions.value.findIndex((x: Question) => x.id == item.id) == -1
      ) {
        this.questions.push(
          this.fb.group({
            id: item.id,
            content: item.content,
            options: this.fb.array(item.options),
          })
        );
        success += 1;
      } else error += 1;
    });
    if (success > 0)
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: `Đã thêm ${success} câu hỏi`,
        life: 2500,
      });
    if (error > 0)
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: `Có ${error} câu hỏi đã tồn tại trong đề`,
        life: 2500,
      });
    this.dialog = false;
  }
}

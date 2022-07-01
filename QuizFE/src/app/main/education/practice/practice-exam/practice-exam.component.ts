import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ScrollTop } from 'primeng/scrolltop';
import { Exam, Question } from 'src/app/models/question';
import { ExamService } from '../../bank/exam/exam.service';
import { PracticeService } from '../practice.service';

@Component({
  selector: 'app-practice-exam',
  templateUrl: './practice-exam.component.html',
  styleUrls: ['./practice-exam.component.scss'],
})
export class PracticeExamComponent implements OnInit {
  @ViewChild('scroll') scroll!: ScrollTop;
  public id = 0;
  public exam: any[] = [];
  public name: any = '';
  public form = new FormGroup({});
  public time = Number.POSITIVE_INFINITY;
  public totalTime = Number.POSITIVE_INFINITY;
  public second = 0;
  public minutes = 0;
  public hour = 0;
  public submitted = false;
  public press = false;

  public currentUser: any = localStorage.getItem('currentUser');
  constructor(
    private _route: ActivatedRoute,
    private _examService: ExamService,
    private _practiceService: PracticeService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.id = this._route.snapshot.params['id'];
    this.form = this.fb.group({
      user: JSON.parse(this.currentUser),
      submissions: this.fb.group({
        answers: this.fb.array([]),
        score: 0,
        total: 0,
      }),
      exam: {},
      submitAt: [],
    });
    this._examService.getExamDetail(this.id).subscribe((res: any) => {
      this.time = res.time * 60;
      this.totalTime = res.time * 60;
      this.name = res.name;
      this.exam = res.questions;
      this.exam.forEach((item: Question) => {
        if (this.isChxbox(item.options)) this.answers.push(this.fb.array([]));
        else this.answers.push(this.fb.control(null));
      });
      this.form.get('submissions')?.patchValue({ total: this.exam.length });
      this.form.get('exam')?.patchValue(res);
    });
    this.clock();
  }

  get answers(): FormArray {
    return this.form.get('submissions')?.get('answers') as FormArray;
  }

  getScore() {
    let score = this.exam.length;
    this.exam.forEach((question: Question, i) => {
      if (this.isChxbox(question.options)) {
        let corrects = question.options.filter(
          (item) => item.isCorrect == true
        );
        let ans: any[] = this.form.value.submissions.answers[i];
        if (corrects.length == ans.length) {
          ans.every((j) => {
            if (question.options[j].isCorrect == false) {
              score -= 1;
              return false;
            } else return true;
          });
        } else score -= 1;
      } else {
        let correct = question.options.findIndex((x) => x.isCorrect == true);
        if (correct != this.form.value.submissions.answers[i]) {
          score -= 1;
        }
      }
    });
    return score;
  }

  onSubmit() {
    this.press = true;
    this.confirmationService.confirm({
      message: `Bạn muốn nộp bài?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      key: 'submit',
      accept: () => {
        this.time = 0;
        this.submitted = true;
        this.form.get('submissions')?.patchValue({ score: this.getScore() });
        this.form.patchValue({ submitAt: new Date() });
        this._practiceService.saveAnswers(this.form.value).subscribe();
        this.result();
      },
    });
  }

  result() {
    this.confirmationService.confirm({
      message: `Bạn đã nộp bài`,
      header: 'Thành công',
      icon: 'pi pi-check',
      key: 'result',
      accept: () => {
      },
    });
  }

  clock() {
    if (this.time > 0)
      setTimeout(() => {
        this.time -= 1;
        this.hour = Math.floor(this.time / 3600);
        this.minutes = Math.floor(this.time / 60);
        this.second = this.time % 60;
        this.clock();
      }, 1000);
  }

  isChxbox(option: any[]) {
    return option.filter((item) => item.isCorrect == true).length != 1;
  }
  selected(i: any, event: any, j: any) {
    const formArray: FormArray = this.form
      .get('submissions')
      ?.get('answers')
      ?.get(i + '') as FormArray;
    /* Selected */
    if (event.checked.length > 0) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.checked[0]));
    } else {
      /* unselected */
      // find the unselected element
      let cnt: number = 0;

      formArray.controls.forEach((ctrl) => {
        if (ctrl.value == j) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(cnt);
          return;
        }

        cnt++;
      });
    }
  }
}

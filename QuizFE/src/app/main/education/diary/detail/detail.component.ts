import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ScrollTop } from 'primeng/scrolltop';
import { Question } from 'src/app/models/question';
import { PracticeService } from '../../practice/practice.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild('scroll') scroll!: ScrollTop;
  public id = 0;
  public exam: any[] = [];
  public userAnswers: any[] = [];
  public user: any = {}
  public name: any = '';
  public score: number = 0;
  public form = new FormGroup({});

  public currentUser: any = localStorage.getItem('currentUser');
  constructor(
    private _route: ActivatedRoute,
    private _practiceService: PracticeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this._route.snapshot.params['id'];
    this.form = this.fb.group({
      user: [],
      submissions: this.fb.group({
        answers: this.fb.array([]),
        score: 0,
        total: 0,
      }),
      exam: [],
      submitAt: [],
    });
    this._practiceService.getAnswersById(this.id).subscribe((res) => {
      this.exam = res.exam.questions;
      this.score = res.submissions.score;
      this.name = res.exam.name
      this.userAnswers = res.submissions.answers;
      this.user = res.user
      this.form.patchValue({ exam: res.exam });
      this.form.patchValue({ user: res.user });
      this.form.patchValue({ submitAt: res.submitAt });
      res.exam.questions.forEach((item: Question) => {
        if (this.isChxbox(item.options)) this.answers.push(this.fb.array([]));
        else this.answers.push(this.fb.control(null));
      });
    });
  }

  get answers(): FormArray {
    return this.form.get('submissions')?.get('answers') as FormArray;
  }

  get f() {
    return this.form.controls;
  }

  isChxbox(option: any[]) {
    return option.filter((item) => item.isCorrect == true).length != 1;
  }
}

import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/models/question';
import { ExamService } from '../bank/exam/exam.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  public examList: Exam[] = [];

  constructor(private _examService: ExamService) {}

  ngOnInit(): void {
    this._examService.getExamList().subscribe((res) => {
      this.examList = res.filter(val => val.isActive == true);
    });
  }
}

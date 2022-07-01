import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PracticeService } from '../practice/practice.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  public data: any[] = [];
  public sizeOption: any[] = [5, 10, 20, 50];
  public size = 5;
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(
    private _practiceService: PracticeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.readAnswer();
  }

  readAnswer() {
    this._practiceService.getAnswers().subscribe((res: any[]) => {
      if (this.currentUser.roles.includes('admin')) this.data = res;
      else
        this.data = res.filter((item) => item.user.id == this.currentUser.id);
    });
  }

  deleteAnswer(answer: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa kết quả này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._practiceService.deleteAnswer(answer.id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa kết quả',
            life: 5000,
          });
          this.readAnswer();
        });
      },
    });
  }
}

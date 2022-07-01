import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'UserManagementWeb';
  public items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      { label: 'Tài khoản', icon: 'pi pi-fw pi-users', routerLink: '/list' },
      {
        label: 'Đào tạo',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Ngân hàng',
            items: [
              {
                label: 'Câu hỏi',
                routerLink: 'question'
              },
              {
                label: 'Đề thi',
                routerLink: 'exam'
              }
            ]
          },
          {
            label: 'Thực hành',
            routerLink: 'practice'
          },
          {
            label: 'Nhật kí',
            routerLink: 'diary'
          }
        ]
      }
    ];
  }
}

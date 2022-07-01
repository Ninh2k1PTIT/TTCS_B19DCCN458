import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  public items: MenuItem[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.currentUser.roles.includes('admin'))
      this.items = [
        { label: 'Tài khoản', icon: 'pi pi-fw pi-users', routerLink: '/list' },
        {
          label: 'Ngân hàng',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {
              label: 'Câu hỏi',
              routerLink: '/question',
            },
            {
              label: 'Đề bài',
              routerLink: '/exam',
            },
          ],
        },
        {
          label: 'Thực hành',
          routerLink: '/practice',
          icon: 'pi pi-fw pi-desktop',
        },
        {
          label: 'Kết quả',
          routerLink: '/diary',
          icon: 'pi pi-fw pi-check-square',
        },
        {
          label: 'Cá nhân',
          routerLink: '/profile',
          icon: 'pi pi-fw pi-user-edit',
        },
      ];
    else
      this.items = [
        {
          label: 'Thực hành',
          routerLink: '/practice',
          icon: 'pi pi-fw pi-desktop',
        },
        {
          label: 'Kết quả',
          routerLink: '/diary',
          icon: 'pi pi-fw pi-check-square',
        },
        {
          label: 'Cá nhân',
          routerLink: '/profile',
          icon: 'pi pi-fw pi-user-edit',
        },
      ];
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['../auth/signin']);
  }
}

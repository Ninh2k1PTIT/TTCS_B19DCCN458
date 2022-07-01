import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { MenubarModule } from 'primeng/menubar';
import { PermissionGuardService } from '../auth/permission-guard.service';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/list',
    canActivate: [PermissionGuardService],
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        canActivate: [PermissionGuardService],
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'question',
        canActivate: [PermissionGuardService],
        loadChildren: () =>
          import('./education/bank/question/question.module').then(
            (m) => m.QuestionModule
          ),
      },
      {
        path: 'practice',
        loadChildren: () =>
          import('./education/practice/practice.module').then(
            (m) => m.PracticeModule
          ),
      },
      {
        path: 'exam',
        canActivate: [PermissionGuardService],
        loadChildren: () =>
          import('./education/bank/exam/exam.module').then((m) => m.ExamModule),
      },
      {
        path: 'diary',
        loadChildren: () =>
          import('./education/diary/diary.module').then((m) => m.DiaryModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MenubarModule, SharedModule, ButtonModule],
  bootstrap: [MainComponent],
})
export class MainModule {}

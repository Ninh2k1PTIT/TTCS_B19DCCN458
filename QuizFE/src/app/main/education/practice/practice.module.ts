import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PracticeComponent } from './practice.component';
import { PracticeExamComponent } from './practice-exam/practice-exam.component';
import { RouterModule, Routes } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PracticeComponent
  },
  {
    path: 'practice-exam/:id',
    component: PracticeExamComponent,
  },
]

@NgModule({
  declarations: [PracticeComponent, PracticeExamComponent],
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    RouterModule.forChild(routes),
    ProgressBarModule,
    ConfirmDialogModule,
    ButtonModule,
    CheckboxModule,
    ScrollTopModule,
    RadioButtonModule,
    PanelModule,
    ReactiveFormsModule
  ],
})
export class PracticeModule {}

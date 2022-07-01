import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RouterModule, Routes } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: '',
    component: ExamComponent,
  },
  {
    path: 'edit-exam',
    component: EditExamComponent,
  },
  {
    path: 'edit-exam/:id',
    component: EditExamComponent,
  },
];

@NgModule({
  declarations: [ExamComponent, EditExamComponent],
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    ReactiveFormsModule,
    InputTextareaModule,
    TableModule,
    ToolbarModule,
    DropdownModule,
    ButtonModule,
    ConfirmDialogModule,
    FormsModule,
    DialogModule,
    RouterModule,
    TagModule,
    RouterModule.forChild(routes),
    InputTextModule
  ],
})
export class ExamModule {}

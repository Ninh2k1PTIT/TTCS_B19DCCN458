import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { QuestionComponent } from './question.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: '',
    component: QuestionComponent,
  },
];

@NgModule({
  declarations: [QuestionComponent],
  imports: [
    CommonModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    RouterModule.forChild(routes),
    InputTextModule
  ],
})
export class QuestionModule {}

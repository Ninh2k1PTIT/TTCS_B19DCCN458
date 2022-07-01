import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ListComponent } from './list.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
];

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    RouterModule.forChild(routes),
    InputTextModule,
  ],
})
export class ListModule {}

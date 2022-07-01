import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DiaryComponent } from './diary.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DetailComponent } from './detail/detail.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [
  {
    path: '',
    component: DiaryComponent,
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  }
];

@NgModule({
  declarations: [DiaryComponent, DetailComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    RouterModule.forChild(routes),
    ButtonModule,
    ConfirmDialogModule,
    ScrollTopModule,
    PanelModule,
    ReactiveFormsModule,
    CheckboxModule,
    RadioButtonModule
  ],
})
export class DiaryModule {}

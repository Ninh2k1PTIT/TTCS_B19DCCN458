import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { ListService } from '../list/list.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public form = {} as FormGroup;
  public submitted: boolean = false;

  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(
    private userService: ListService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group(
      {
        username: [this.currentUser.username, Validators.required],
        password: [this.currentUser.password, Validators.required],
        dob: [new Date(this.currentUser.dob), Validators.required],
        fullName: [this.currentUser.fullName, Validators.required],
        email: [
          this.currentUser.email,
          [Validators.required, Validators.email],
        ],
        confirmPassword: [this.currentUser.password, Validators.required],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    const body: User = {
      username: this.form.value.username,
      password: this.form.value.password,
      dob: this.form.value.dob,
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      roles: ['user'],
      id: this.currentUser.id,
    };
    if (this.form.valid)
      this.userService.updateUser(body).subscribe((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật thông tin',
        });
      });
  }

  get f() {
    return this.form.controls;
  }
}

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ ConfirmPassword: true });
      return true;
    } else {
      return null;
    }
  }
}

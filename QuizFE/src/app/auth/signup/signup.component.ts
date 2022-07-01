import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ListService } from 'src/app/main/list/list.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public form = {} as FormGroup;
  public submitted: boolean = false;

  constructor(
    private userService: ListService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        dob: ['', Validators.required],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    const body: User = {
      username: this.form.value.username,
      password: this.form.value.password,
      dob: this.form.value.dob,
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      roles: ['user'],
      id: 0,
    };
    if (this.form.valid)
      this.userService.creatUser(body).subscribe((user) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo tài khoản mới',
        });
        setTimeout(() => {
          this.router.navigate(['../auth/signin']);
        }, 1000);
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

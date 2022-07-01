import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListService } from 'src/app/main/list/list.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public form = {} as FormGroup;
  public submitted: boolean = false;

  constructor(
    private userService: ListService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const body = this.form.value;
      this.userService.getUserList().subscribe((users) => {
        const currentUser = users.find(
          (user) =>
            body.username === user.username && body.password === user.password
        );
        if (currentUser) {
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          if (currentUser.roles.includes('admin'))
            this.router.navigate(['../../list']);
          else this.router.navigate(['../../practice']);
        } else console.log('no');
      });
    }
  }

  get f() {
    return this.form.controls;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationRequest } from 'src/app/core/models/register-req.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public registerForm: FormGroup;

  public errorMessages: string[];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
   }

   public registerUser(): void {
    const user: RegistrationRequest = {
      userName: this.registerForm.controls.name.value,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value,
      confirmPassword: this.registerForm.controls.confirmPassword.value,
    };
    this.authService.registerUser('account/register', user)
    .subscribe(
      res => {
        console.log('Successful registration');
        this.router.navigate(['']);
      },
      error => {
        error.error.errors.ConfirmPassword
          ? this.errorMessages = [...error.error.errors.ConfirmPassword]
          : this.errorMessages = [...error.error.errors];
      }
    );
  }
}

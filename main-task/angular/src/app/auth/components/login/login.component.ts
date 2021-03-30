import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { AuthResponse } from 'src/app/core/models/auth-res.model';
import { GoogleAuthRequest } from 'src/app/core/models/google-auth-req.model';
import { LoginRequest } from 'src/app/core/models/login-req.model';
import { SocialAuthRequest } from 'src/app/core/models/social-auth-req.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public authForm: FormGroup;
  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private dialog: MatDialog) {
    this.authForm = fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public loginUser(): void {
    const userForAuth: LoginRequest = {
      userName: this.authForm.controls.login.value,
      password: this.authForm.controls.password.value
    };
    this.isLoading = true;
    this.authService.loginUser('account/login', userForAuth).subscribe(
      res => {
        this.isLoading = false;
        localStorage.setItem('accessToken', res.tokens.accessToken);
        localStorage.setItem('refreshToken', res.tokens.refreshToken);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate(['']);
      },
      error => {
        this.isLoading = false;
        this.dialog.open(ErrorDialogComponent);
        this.errorMessage = error.error.errorMessage;
      }
    );
  }

  public validateExternalAuth(externalLogin: Observable<AuthResponse>): void {
    externalLogin.subscribe(
      res => {
        localStorage.setItem('accessToken', res.tokens.accessToken);
        localStorage.setItem('refreshToken', res.tokens.refreshToken);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate(['']);
      },
      error => {
        this.errorMessage = error.error.errorMessage;
      }
    );
  }

  public externalGoogleLogin = () => {
    this.isLoading = true;
    this.authService.signInWithGoogle()
    .then(
      res => {
        this.isLoading = false;
        const user: SocialUser = { ...res };
        const externalAuth: GoogleAuthRequest = {
          provider: user.provider,
          idToken: user.idToken
        };
        this.validateExternalAuth(this.authService.externalGoogleLogin('account/googleexternallogin', externalAuth));
      },
      error => {
        this.isLoading = false;
        this.dialog.open(ErrorDialogComponent);
      }
    );
  }

  public externalFbLogin = () => {
    this.isLoading = true;
    this.authService.signInWithFB()
    .then(
      res => {
        this.isLoading = false;
        const user: SocialUser = { ...res };
        const externalAuth: SocialAuthRequest = {
          id: user.id,
          provider: user.provider,
          authToken: user.authToken,
          name: user.name,
          email: user.email
        };
        this.validateExternalAuth(this.authService.externalSocialLogin('account/fbexternallogin', externalAuth));
      },
      error => {
        this.isLoading = false;
        this.dialog.open(ErrorDialogComponent);
      }
    );
  }

  public externalMicrosoftLogin = () => {
    this.authService.signInWithMicrosoft()
    .then(
      res => {
        const user: SocialUser = { ...res };
        // const externalAuth: SocialAuthRequest = {
        //   provider: user.provider,
        //   authToken: user.authToken,
        //   name: user.name,
        //   email: user.email
        // };
        console.log(user);
       // this.validateExternalAuth(this.authService.externalSocialLogin('account/vkexternallogin', externalAuth));
      },
      error => console.log(error)
    );
  }

  public onRedirect(): void {
    this.router.navigate(['auth', 'register']);
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { MicrosoftLoginProvider, GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return localStorage.getItem('accessToken'); },
        allowedDomains: [environment.urlAddress, 'localhost:44363'],
        throwNoTokenError: true,
      }
    }),
    CoreModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '5268472071-5kj8krk5vu9hiqtls7pahp07sbhhg8jj.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '887024055414938'
            )
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              'beff7eb0-68e1-4b8d-a2b6-65d94efbd1fc'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

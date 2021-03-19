import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RequestService } from './services/request.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerService } from './services/error-handler.service';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UserService } from '../admin/services/user.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ForbiddenComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ForbiddenComponent,
  ],
  providers: [
    RequestService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true,
    },
  ]
})
export class CoreModule { }

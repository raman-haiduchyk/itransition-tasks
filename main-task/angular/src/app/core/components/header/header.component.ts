import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public isUserAuthenticated: boolean;
  public isUserAdmin: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.authChanged
    .subscribe(res => {
      console.log(res);
      this.isUserAuthenticated = res;
      this.isUserAdmin = authService.isUserAdmin();
    });
  }

  public ngOnInit(): void {

  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['auth']);
  }

  public navigate(route: string): void {
    this.router.navigate([route]);
  }

}

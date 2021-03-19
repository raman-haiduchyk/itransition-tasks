import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: Profile;

  constructor(private profileService: ProfileService) { }

  public ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      res => {
        this.profile = res;
      }
    );
  }

}

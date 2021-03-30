import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'src/app/profile/models/profile.model';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Profile) { }

  public ngOnInit(): void {
  }

}

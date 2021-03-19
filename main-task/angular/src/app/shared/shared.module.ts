import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule}  from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    FlexLayoutModule,
    FormsModule
  ]
})
export class SharedModule { }

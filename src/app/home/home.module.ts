import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ]
})
export class HomeModule { }

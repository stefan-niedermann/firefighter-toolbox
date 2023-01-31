import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatStepperModule } from '@angular/material/stepper';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';


export const CALENDARS: InjectionToken<Map<string, Map<string, string>>> = new InjectionToken<Map<string, Map<string, string>>>('CALENDAR');

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: CalendarComponent
      }
    ])
  ],
  declarations: [
    CalendarComponent
  ],
  providers: [
    { provide: CALENDARS, useValue: environment.calendars }
  ]
})
export class CalendarModule { }
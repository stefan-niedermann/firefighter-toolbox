import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CALENDARS } from './calendar.module';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  public station: Map<string, string> = this.calendar.values().next().value ?? new Map();

  public readonly form = this.fb.group({
    os: 'android',
    calendar: this.station.values().next().value as string
  });

  public setStation(station: Map<string, string>) {
    this.station = station;
    this.form.controls.calendar.patchValue(this.station.values().next().value);
  }

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly sb: MatSnackBar,
    @Inject(CALENDARS) public readonly calendar: Map<string, Map<string, string>>
  ) { }

  public onCopiedToClipboard() {
    this.sb.open('URL kopiert', undefined, { duration: 1_000 });
  }
}
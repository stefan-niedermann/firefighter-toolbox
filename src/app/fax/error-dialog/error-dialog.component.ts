import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent implements OnInit {

  e: Error = new Error();

  constructor(
    @Inject(MAT_DIALOG_DATA) private err: any,
  ) { }

  ngOnInit() {
    this.e = (this.err instanceof Error)
      ? this.err
      : new Error(this.err);
  }

}

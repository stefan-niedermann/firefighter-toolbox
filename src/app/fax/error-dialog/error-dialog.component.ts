import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent implements OnInit {

  error: Error = new Error();

  constructor(
    @Inject(MAT_DIALOG_DATA) private param: any,
  ) { }

  ngOnInit() {
    const error = (this.param instanceof Error)
      ? this.param
      : new Error(this.param);
    error.message = encodeURIComponent(error.message);
    this.error = error;
  }

}

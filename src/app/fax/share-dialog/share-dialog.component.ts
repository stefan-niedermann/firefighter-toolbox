import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html'
})
export class ShareDialogComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public url: string,
    private readonly bottomSheetRef: MatBottomSheetRef,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
  ) { }

  copyLink(link: string) {
    this.clipboard.copy(link);
    this.snackbar.open('Link kopiert', undefined, { duration: 2500 });
    this.bottomSheetRef.dismiss();
  }
}
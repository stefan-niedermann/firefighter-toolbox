import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, SecurityContext } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

  readonly socialMediaChannels: SocialMedia[] = [
    { name: 'Telegram', icon: 'telegram', generateShareUrl: (encodedUrl) => `tg://msg_url?url=${encodedUrl}` },
    { name: 'Whatsapp', icon: 'whatsapp', generateShareUrl: (encodedUrl) => `whatsapp://send?text=${encodedUrl}` },
    { name: 'E-Mail', icon: 'mail', generateShareUrl: (encodedUrl) => `mailto:?body=${encodedUrl}` },
    { name: 'SMS', icon: 'sms', generateShareUrl: (encodedUrl) => `sms:?body=${encodedUrl}` }
  ];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) private readonly url: string,
    private readonly bottomSheetRef: MatBottomSheetRef,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    readonly sanitizer: DomSanitizer,
  ) {
    for (let channel of this.socialMediaChannels) {
      channel.safeShareUrl = sanitizer.bypassSecurityTrustUrl(channel.generateShareUrl(encodeURI(url)));
    }
  }

  copyLink() {
    this.clipboard.copy(this.url);
    this.snackbar.open('Link kopiert', undefined, { duration: 2500 });
    this.bottomSheetRef.dismiss();
  }
}

interface SocialMedia {
  name: string,
  icon: string,
  generateShareUrl: (encodedUrl: string) => string,
  safeShareUrl?: SafeUrl
}
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MockPipe, MockProvider } from 'ng-mocks';
import { UrlEncodePipe } from '../url-encode-pipe/url-encode.pipe';

import { ShareDialogComponent } from './share-dialog.component';

describe('ShareDialogComponent', () => {
  let component: ShareDialogComponent;
  let fixture: ComponentFixture<ShareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatIconModule,
        MatSnackBarModule,
        ClipboardModule,
      ],
      declarations: [
        ShareDialogComponent,
        MockPipe(UrlEncodePipe),
      ],
      providers: [
        MockProvider(MatBottomSheetRef),
        MockProvider(DomSanitizer),
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: '' }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

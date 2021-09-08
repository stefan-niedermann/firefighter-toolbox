import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDeclaration, MockProvider } from 'ng-mocks';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { FaxComponent } from './fax.component';
import { FaxService } from './fax.service';
import { NominatimService } from './nominatim.service';
import { UtilService } from './util.service';

describe('FaxComponent', () => {
  let component: FaxComponent;
  let fixture: ComponentFixture<FaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTooltipModule,
        FormsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        ClipboardModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
      ],
      providers: [
        MockProvider(FaxService),
        MockProvider(UtilService),
        MockProvider(NominatimService),
        MockProvider(ActivatedRoute),
        MockProvider(Router)
      ],
      declarations: [
        FaxComponent,
        MockDeclaration(PdfViewerComponent)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

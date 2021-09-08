import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDeclaration, MockProvider } from 'ng-mocks';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { FaxService } from './fax.service';
import { UtilService } from './util.service';
import { FaxComponent } from './fax.component';
import { NominatimService } from './nominatim.service';

describe('FaxComponent', () => {
  let component: FaxComponent;
  let fixture: ComponentFixture<FaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ClipboardModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTooltipModule,
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

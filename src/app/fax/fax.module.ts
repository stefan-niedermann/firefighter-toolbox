import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NominatimDialogComponent } from './nominatim-dialog/nominatim-dialog.component';

import { FaxComponent } from './fax.component';


@NgModule({
  declarations: [
    FaxComponent,
    NominatimDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfViewerModule,
    ClipboardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterModule.forChild([
      {
        path: '',
        component: FaxComponent
      }
    ])
  ]
})
export class FaxModule { }

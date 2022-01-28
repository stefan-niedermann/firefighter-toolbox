import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { GeneratedLicenseFileAvailable } from './about/licenses/licenses.service';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule.withConfig({
      disableAnimations: window.matchMedia("(prefers-reduced-motion)").matches
    }),
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [
    DatePipe,
    { provide: GeneratedLicenseFileAvailable, useValue: environment.production }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

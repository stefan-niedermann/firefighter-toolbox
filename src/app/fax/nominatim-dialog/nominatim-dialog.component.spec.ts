import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominatimDialogComponent } from './nominatim-dialog.component';

describe('NominatimDialogComponent', () => {
  let component: NominatimDialogComponent;
  let fixture: ComponentFixture<NominatimDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominatimDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominatimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

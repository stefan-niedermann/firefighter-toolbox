import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, EMPTY, merge, of, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FaxService } from './fax.service';

@Component({
  selector: 'app-fax',
  templateUrl: './fax.component.html',
  styleUrls: ['./fax.component.scss']
})
export class FaxComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();

  blobUri$ = new BehaviorSubject<URL | null>(null);
  uri = '';

  form: FormGroup = new FormGroup({
    mitteiler: new FormControl('\n\n\n'),
    einsatzort: new FormGroup({
      strasse: new FormControl(''),
      hnr: new FormControl(''),
      objekt: new FormControl(''),
      ort: new FormControl('')
    }),
    zielort: new FormGroup({
      strasse: new FormControl(''),
      hnr: new FormControl(''),
      objekt: new FormControl(''),
      ort: new FormControl('')
    }),
    patient: new FormControl('\n\n\n'),
    einsatzgrund: new FormGroup({
      schlagwort: new FormControl(''),
      stichwort: new FormControl('')
    }),
    einsatzmittel: new FormArray([
      new FormGroup({
        name: new FormControl(''),
        alarmiert: new FormControl(''),
        aus: new FormControl('')
      })
    ]),
    bemerkung: new FormControl('\n\n\n')
  });
  einsatzmittel = this.form.get('einsatzmittel') as FormArray;

  constructor(
    private readonly faxService: FaxService
  ) {
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((next: any) => {
        const newBlobUri = new URL(URL.createObjectURL(this.faxService.generateFax(next)));
        this.blobUri$.next(newBlobUri);
        this.uri = newBlobUri.toString();
      })
    this.form.updateValueAndValidity();
  }

  addEinsatzmittel() {
    this.einsatzmittel.push(
      new FormGroup({
        name: new FormControl(''),
        alarmiert: new FormControl(''),
        aus: new FormControl('')
      })
    );
  }

  removeEinsatzmittel(index: number) {
    this.einsatzmittel.removeAt(index);
  }

  download() {
    const val = this.blobUri$.getValue();
    if (val) {
      const a = document.createElement('a');
      a.setAttribute('download', '');
      a.setAttribute('href', val.toString())
      a.click();
    } else {
      // TODO Toast
      console.warn('PDF not yet available.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

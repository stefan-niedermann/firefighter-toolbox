import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounce, map, merge, of, tap, timer } from 'rxjs';
import { FaxService } from './fax.service';

@Component({
  selector: 'app-fax',
  templateUrl: './fax.component.html',
  styleUrls: ['./fax.component.scss']
})
export class FaxComponent {

  form: FormGroup = new FormGroup({
    mitteiler: new FormControl(''),
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
    patient: new FormControl(''),
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
    bemerkung: new FormControl('')
  });
  einsatzmittel = this.form.get('einsatzmittel') as FormArray;

  private readonly currentUrl$ = new BehaviorSubject<string | null>(null);
  readonly url$ = merge(
    of(this.form.value),
    this.form.valueChanges
      .pipe(debounce(_ => timer(500)))
  ).pipe(
    map(next => this.faxService.generateFax(next)),
    map(blob => URL.createObjectURL(blob)),
    tap(url => this.currentUrl$.next(url))
  );

  constructor(
    private readonly faxService: FaxService
  ) {
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
    const url = this.currentUrl$.getValue();
    if (url !== null) {
      const a = document.createElement('a');
      const date = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
      a.setAttribute('download', `Übungs-Fax ${date}.pdf`);
      a.setAttribute('href', url)
      a.click();
    } else {
      console.warn('PDF is not yet available.');
    }
  }
}

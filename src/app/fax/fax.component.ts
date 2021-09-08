import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounce, map, merge, Observable, ReplaySubject, switchMap, tap, timer } from 'rxjs';
import { FaxService } from './fax.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinates, NominatimService } from './nominatim.service';

@Component({
  selector: 'app-fax',
  templateUrl: './fax.component.html',
  styleUrls: ['./fax.component.scss']
})
export class FaxComponent implements OnInit {

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
  nominatimEnabled$ = this.nominatimService.isEnabled();
  einsatzortCoordinates$ = (this.form.get('einsatzort') as FormControl).valueChanges.pipe(
    debounce(_ => timer(500)),
    switchMap(einsatzort => this.nominatimService.getCoordinates(einsatzort))
  );

  private readonly initialFormState = new ReplaySubject(1);
  private readonly currentUrl$ = new BehaviorSubject<string | null>(null);
  readonly url$ = merge(
    this.initialFormState,
    this.form.valueChanges.pipe(debounce(_ => timer(500)))
  ).pipe(
    map(next => this.faxService.generateFax(next)),
    map(blob => URL.createObjectURL(blob)),
    tap(url => this.currentUrl$.next(url))
  );

  constructor(
    private readonly faxService: FaxService,
    private readonly nominatimService: NominatimService,
    private readonly clipboard: Clipboard,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParamMap.has('content')) {
      const param = this.activatedRoute.snapshot.queryParamMap.get('content') || '';
      const obj = this.faxService.deserialize(param);
      this.form.patchValue(obj);
      this.einsatzmittel.clear();
      if (Array.isArray(obj.einsatzmittel)) {
        for (let e of obj.einsatzmittel) {
          this.addEinsatzmittel(e.name, e.alarmiert, e.aus);
        }
      }
      this.router.navigate([]);
    }
    this.initialFormState.next(this.form.value);
  }

  addEinsatzmittel(name = '', alarmiert = '', aus = '') {
    this.einsatzmittel.push(
      new FormGroup({
        name: new FormControl(name),
        alarmiert: new FormControl(alarmiert),
        aus: new FormControl(aus)
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
      a.setAttribute('download', this.faxService.generateDownloadFilename());
      a.setAttribute('href', url)
      a.click();
    } else {
      console.warn('PDF is not yet available.');
    }
  }

  copyLink() {
    this.clipboard.copy(`${location.protocol}//${location.host}${location.pathname}?content=${this.faxService.serialize(this.form.value)}`);
    this.snackbar.open('Link wurde in die Zwischenablage kopiert', undefined, { duration: 2500 });
  }

  setNominatimState(state: boolean) {
    this.nominatimService.setStatus(state);
  }

  showNominatimInfo() {

  }
}

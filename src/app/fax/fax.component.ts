import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounce, map, merge, Observable, ReplaySubject, startWith, switchMap, take, tap, timer } from 'rxjs';
import { FaxService } from './fax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NominatimService } from './nominatim.service';
import { MatDialog } from '@angular/material/dialog';
import { NominatimDialogComponent } from './nominatim-dialog/nominatim-dialog.component';
import { Stichwoerter } from './stichwoerter';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Component({
  selector: 'app-fax',
  templateUrl: './fax.component.html',
  styleUrls: ['./fax.component.scss']
})
export class FaxComponent implements OnInit {

  @ViewChild('printIframe', { static: false }) printIframe: undefined | ElementRef<HTMLIFrameElement>;

  private readonly initialFormState = new ReplaySubject(1);
  private readonly currentUrl$ = new BehaviorSubject<string | null>(null);

  readonly form: FormGroup = new FormGroup({
    mitteiler: new FormControl(''),
    einsatzort: new FormGroup({
      strasse: new FormControl(''),
      hnr: new FormControl(''),
      objekt: new FormControl(''),
      ort: new FormControl(''),
      nominatimEnabled: new FormControl(this.nominatimService.isEnabled()),
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
    bemerkung: new FormControl(''),
  });
  readonly einsatzmittel = this.form.get('einsatzmittel') as FormArray;
  readonly filteredStichwoerter: Observable<string[]> = (this.form.get('einsatzgrund')?.get('stichwort') as FormGroup).valueChanges.pipe(
    startWith(''),
    map(value => {
      const filterValue = value.toLowerCase();
      return Stichwoerter.filter(stichwort => stichwort.toLowerCase().startsWith(filterValue));
    })
  );
  readonly url$ = merge(
    this.initialFormState,
    this.form.valueChanges.pipe(
      tap(values => this.router.navigate([], { queryParams: { 'content': this.faxService.serialize(values, false) } })),
      debounce(_ => timer(500)),
    )
  ).pipe(
    switchMap(next => this.faxService.generateFax(next)),
    map(blob => URL.createObjectURL(blob)),
    tap(url => this.currentUrl$.next(url)),
  );

  constructor(
    private readonly faxService: FaxService,
    private readonly nominatimService: NominatimService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet,
    private readonly platform: Platform,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParamMap.has(this.faxService.QUERY_PARAM_KEY)) {
      try {
        const param = this.activatedRoute.snapshot.queryParamMap.get(this.faxService.QUERY_PARAM_KEY) || '';
        const obj = this.faxService.deserialize(param);
        this.form.patchValue(obj);
        this.einsatzmittel.clear();
        if (obj.einsatzmittel) {
          for (let e of obj.einsatzmittel) {
            this.addEinsatzmittel(e.name, e.alarmiert, e.aus);
          }
        }
      } catch (e) {
        this.handleError('Fehler beim Laden der Parameter', e);
      }
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
      this.handleError('Fehler beim Laden der Parameter', new Error('currentUrl$ value is null'));
    }
  }

  toggleNominatim() {
    this.nominatimService.toggle();
  }

  showNominatimInfo() {
    this.dialog.open(NominatimDialogComponent);
  }

  share() {
    const shareLink = this.faxService.generateShareLink(this.form.value);
    if ('share' in navigator) {
      navigator.share({
        title: this.faxService.generateDownloadFilename(),
        url: shareLink
      })
        .then(() => console.log('Successful share'))
        .catch((e) => {
          if (e.name !== 'AbortError') {
            this.handleError('Fehler beim Teilen', e);
          }
        });
    } else {
      this.bottomSheet.open(ShareDialogComponent, {
        data: shareLink
      });
    }
  }

  print() {
    const url = this.currentUrl$.getValue();
    if (url !== null) {
      const iframe = this.printIframe?.nativeElement;
      if (iframe) {
        iframe.setAttribute('src', url);
        iframe.onload = () => {
          if (this.platform.FIREFOX) {
            const renderTime = 1000;
            this.snackbar.open('Fax wird gedruckt…', undefined, { duration: renderTime });
            setTimeout(() => iframe.contentWindow?.print(), renderTime);
          } else {
            iframe.contentWindow?.print();
          }
        }
      } else {
        this.handleError('Fehler beim Laden der Parameter', new Error('iframe is falsy'));
      }
    } else {
      this.handleError('Fehler beim Laden der Parameter', new Error('currentUrl$ value is null'));
    }
  }

  private handleError(title: string, err: unknown) {
    this.snackbar.open(title, 'Mehr', { duration: 5000 })
      .onAction()
      .pipe(take(1))
      .subscribe(_ => this.dialog.open(ErrorDialogComponent, { data: err }))
  }
}

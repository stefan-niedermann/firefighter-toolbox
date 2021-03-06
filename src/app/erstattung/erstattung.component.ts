import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, filter, from, map, Observable, startWith, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { ErrorDialogComponent } from '../shared/error-dialog/error-dialog.component';
import { ErstattungService } from './erstattung.service';

@Component({
  selector: 'app-erstattung',
  templateUrl: './erstattung.component.html',
  styleUrls: ['./erstattung.component.scss']
})
export class ErstattungComponent implements OnInit, OnDestroy {

  @ViewChild('printIframe', { static: false }) printIframe!: ElementRef<HTMLIFrameElement>;

  private readonly unsubscribe$ = new Subject<void>()
  readonly isPersistenceEnabledOnStartup = this.service.isPersistenceEnabled()
  private readonly persistedPayload = this.service.getPersistedPayload()
  readonly form: UntypedFormGroup = new UntypedFormGroup({
    allgemeines: new UntypedFormGroup({
      wehr: new UntypedFormControl(this.persistedPayload.wehr),
      aussteller: new UntypedFormControl(this.persistedPayload.aussteller),
      rolle: new UntypedFormControl(this.persistedPayload.rolle || '1. Kommandant'),
      ort: new UntypedFormControl(this.persistedPayload.ort),
      kontakt: new UntypedFormControl(this.persistedPayload.kontakt),
      persist: new UntypedFormControl(this.isPersistenceEnabledOnStartup)
    }),
    einsatz: new UntypedFormGroup({
      grund: new UntypedFormControl(''),
      datum: new UntypedFormControl(new Date())
    }),
    personal: new UntypedFormArray([
      new UntypedFormGroup({
        name: new UntypedFormControl(''),
        von: new UntypedFormControl(''),
        bis: new UntypedFormControl('')
      })
    ]),
  })
  readonly rollen$ = this.service.getRollen(this.form.get('allgemeines')!.get('rolle')!.valueChanges)
  readonly gruende$ = this.service.getGruende(this.form.get('einsatz')!.get('grund')!.valueChanges)
  readonly personal = this.form.get('personal') as UntypedFormArray

  readonly url$ = this.form.valueChanges
    .pipe(
      debounceTime(500),
      startWith(this.form.value),
      switchMap(value => from(this.service
        .mergePdfs(this.service.generateFax(value))
        .then(blob => URL.createObjectURL(blob))
      ))
    )

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly service: ErstattungService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form.get('allgemeines')!.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(_ => this.service.isPersistenceEnabled()),
      )
      .subscribe((allgemeines: any) => this.service.persistPayload(allgemeines))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  addPerson(
    name = '',
    von = this.personal.at(this.personal.length - 1)?.get('von')?.value || '',
    bis = this.personal.at(this.personal.length - 1)?.get('bis')?.value || ''
  ) {
    this.personal.push(
      new UntypedFormGroup({
        name: new UntypedFormControl(name),
        von: new UntypedFormControl(von),
        bis: new UntypedFormControl(bis)
      })
    )
    this.cdr.detectChanges();
    (document.querySelector('[formArrayName="personal"] li:last-child input') as HTMLElement)?.focus()
  }

  removePerson(index: number) {
    this.personal.removeAt(index);
  }

  @HostListener('document:keydown.control.s', ['$event'])
  async download(event?: KeyboardEvent) {
    event?.preventDefault();
    this.service.mergePdfs(this.service.generateFax(this.form.value))
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        if (url !== null) {
          const a = document.createElement('a');
          a.setAttribute('download', 'Antrag auf Erstattung.pdf');
          a.setAttribute('href', url)
          a.click();
        } else {
          this.handleError('Fehler beim Herunterladen', new Error('url value is null'));
        }
      })
  }

  @HostListener('document:keydown.control.p', ['$event'])
  print(event?: KeyboardEvent) {
    event?.preventDefault();
    this.service.mergePdfs(this.service.generateFax(this.form.value))
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        if (url !== null) {
          const iframe = this.printIframe.nativeElement
          iframe.setAttribute('src', url)
          iframe.onload = () => iframe.contentWindow?.print()
        } else {
          this.handleError('Fehler beim Laden der Parameter', new Error('url value is null'));
        }
      })
  }

  public togglePersistence() {
    if (this.service.isPersistenceEnabled()) {
      this.service.disablePersistence()
    } else {
      this.service.enablePersistence()
      this.service.persistPayload(this.form.get('allgemeines')!.value)
    }
  }

  private handleError(title: string, err: unknown) {
    this.snackbar.open(title, 'Mehr', { duration: 5000 })
      .onAction()
      .pipe(take(1))
      .subscribe(_ => this.dialog.open(ErrorDialogComponent, { data: err }))
  }
}

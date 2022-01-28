import { Injectable } from '@angular/core'
import { PDFDocument, PDFPage } from 'pdf-lib'
import { jsPDF } from 'jspdf'
import { DatePipe } from '@angular/common'
import { map, Observable, of, startWith } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ErstattungService {

  private readonly persistenceKey = 'erstattung'
  private readonly paddingTop = 27
  private readonly paddingLeft = 20

  private readonly rollen = [
    '1. Kommandant',
    'Stellv. Kommandant',
    'Einsatzleiter',
    'Bürgermeister',
    '1. Vorstand',
    '2. Vorstand'
  ]

  private readonly gruende = [
    'Brandeinsatz',
    'THL-Einsatz',
    'Verkehrsunfall'
  ]

  constructor(
    private readonly datePipe: DatePipe
  ) { }

  public isPersistenceEnabled(): boolean {
    return localStorage.getItem(this.persistenceKey) !== null
  }

  public enablePersistence() {
    localStorage.setItem(this.persistenceKey, JSON.stringify({}))
  }

  public disablePersistence() {
    localStorage.removeItem(this.persistenceKey)
  }

  public persistPayload(value: any) {
    localStorage.setItem(this.persistenceKey, JSON.stringify(value))
  }

  public getPersistedPayload() {
    return JSON.parse(localStorage.getItem(this.persistenceKey) || JSON.stringify({}))
  }

  public getRollen(term: Observable<string>) {
    return term.pipe(
      startWith(''),
      map(value => value.toLowerCase()),
      map(value => this.rollen.filter(rolle => rolle.toLowerCase().indexOf(value) >= 0))
    )
  }

  public getGruende(term: Observable<string>) {
    return term.pipe(
      startWith(''),
      map(value => value.toLowerCase()),
      map(value => this.gruende.filter(grund => grund.toLowerCase().indexOf(value) >= 0))
    )
  }

  public generateFax(value: any): ArrayBuffer[] {
    if (value.personal.length < 1) {
      value.personal = [{
        name: '',
        von: '',
        bis: ''
      }]
    }
    return value.personal.map((person: any) => {
      const doc = new jsPDF({
        compress: true,
        putOnlyUsedFonts: true
      })

      doc.setTextColor('#000000')
      doc.setFontSize(12)

      const img = new Image()
      img.src = 'assets/erstattung/logo.png'
      doc.addImage(img, 'png', this.paddingLeft + 140, this.paddingTop - 10, 30, 30)

      doc.text(`Feuerwehr ${value.allgemeines.wehr || '___________________________________'}`, this.paddingLeft, this.paddingTop + .5)
      doc.setFont(undefined as any, 'bold')
      doc.text('Feuerwehrdienstbescheinigung', this.paddingLeft, this.paddingTop + 7.8)
      doc.setFont(undefined as any, 'normal')
      doc.text('Antrag auf Erstattung fortgewährter Leistung im Zusammenhang mit dem Feuerwehrdienst', this.paddingLeft, this.paddingTop + 46.8)
      doc.text('gemäß Art. 9, Art. 10 BayFwG.', this.paddingLeft, this.paddingTop + 52.4)
      doc.text('Sehr geehrte Damen und Herren,', this.paddingLeft, this.paddingTop + 72.6)
      doc.text(`Herr / Frau ${person.name || '___________________________________'}`, this.paddingLeft, this.paddingTop + 87.2)
      doc.text(`hat am ${this.datePipe.transform(value.einsatz.datum, 'mediumDate')}`, this.paddingLeft, this.paddingTop + 97.0)
      doc.text(`in der Zeit von ${person.von || '____________'} Uhr bis ${person.bis || '____________'} Uhr`, this.paddingLeft, this.paddingTop + 106.7)
      doc.text(`an einem ${value.einsatz.grund || '___________________________________'}`, this.paddingLeft, this.paddingTop + 116.4)
      doc.text(`der Feuerwehr ${value.allgemeines.wehr || '___________________________________'} teilgenommen.`, this.paddingLeft, this.paddingTop + 126.2)
      doc.text(`Für Rückfragen stehe ich${value.allgemeines.kontakt ? ` unter ${value.allgemeines.kontakt}` : ''} gerne zur Verfügung.`, this.paddingLeft, this.paddingTop + 143.2)
      doc.text('Mit freundlichen Grüßen,', this.paddingLeft, this.paddingTop + 174.6)
      doc.text(value.allgemeines.aussteller || '___________________________________', this.paddingLeft, this.paddingTop + 189.2)
      doc.text(value.allgemeines.rolle || '___________________________________', this.paddingLeft, this.paddingTop + 196.5)
      doc.text(`Feuerwehr ${value.allgemeines.wehr}`, this.paddingLeft, this.paddingTop + 202.1)
      doc.text(`${value.allgemeines.ort || value.allgemeines.name || '________________'}, ${this.datePipe.transform(new Date(), 'mediumDate')}`, this.paddingLeft, this.paddingTop + 229.6)
      doc.text('___________________________________', this.paddingLeft + 87.6, this.paddingTop + 229.6)
      doc.text('Unterschrift', this.paddingLeft + 87.6, this.paddingTop + 236.9)

      return doc.output('arraybuffer')
    })
  }

  /**
   * @see https://stackoverflow.com/a/61811196
   */
  async mergePdfs(pdfsToMerge: ArrayBuffer[]): Promise<Blob> {
    const mergedPdf: PDFDocument = await PDFDocument.create()

    const createInnerPromise = async (arrayBuffer: ArrayBuffer): Promise<PDFPage[]> => {
      const pdf: PDFDocument = await PDFDocument.load(arrayBuffer)
      return await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    }

    const outerPromise: Promise<PDFPage[]>[] = pdfsToMerge.map((arrayBuffer) => createInnerPromise(arrayBuffer))
    const resultOuterPromise: PDFPage[][] = await Promise.all(outerPromise)

    resultOuterPromise.forEach((pageArray: PDFPage[]) =>
      pageArray.forEach((page: PDFPage) =>
        mergedPdf.addPage(page)
      )
    )

    return new Blob([(await mergedPdf.save()).buffer])
  }
}
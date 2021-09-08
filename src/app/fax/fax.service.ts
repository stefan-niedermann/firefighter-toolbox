import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { map, Observable, switchMap } from 'rxjs';
import { NominatimService } from './nominatim.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class FaxService {

  private readonly x = 20;

  constructor(
    private readonly utils: UtilService,
    private readonly nominatimService: NominatimService
  ) { }

  public generateFax(value: any): Observable<Blob> {
    return this.nominatimService.getCoordinates(value.einsatzort).pipe(
      map(coordinates => {
        let y = 25;

        const getY = (doc: jsPDF) => {
          if (y > doc.internal.pageSize.height - 30) {
            doc.addPage();
            this.addWaterMark(doc);
            y = 25;
          }
          return y += 4.5;
        }

        const doc = new jsPDF();

        doc.setFont("courier", "normal");
        doc.setTextColor('#000000');
        doc.setFontSize(11)

        this.addWaterMark(doc);

        doc.text("------ FAX ------ FAX ------ FAX ------ FAX ------ FAX ------ FAX -------", this.x, getY(doc));
        doc.text("Absender   : ILS MITTELFRANKEN SÜD", this.x, getY(doc));
        doc.text(`Fax        : +49  (${this.utils.random(4)}) / ${this.utils.random(7)}`, this.x, getY(doc));
        doc.text("Termin     :", this.x, getY(doc));
        doc.text(`Einsatznummer: T ${this.utils.random()}.${this.utils.random()} ${this.utils.random(6)} ${this.utils.random(2)}`, this.x, getY(doc));
        doc.text('------------------------------  MITTEILER  ------------------------------', this.x, getY(doc));
        this.insertParagraph(doc, value.mitteiler, getY);
        doc.text('------------------------------  EINSATZORT  -----------------------------', this.x, getY(doc));
        doc.text(`Straße     : ${value.einsatzort.strasse}`, this.x, getY(doc));
        doc.text(`Haus-Nr.   : ${value.einsatzort.hnr}`, this.x, getY(doc));
        doc.text(`Ort        : ${value.einsatzort.ort}`, this.x, getY(doc));
        doc.text(`Objekt     : ${value.einsatzort.objekt}`, this.x, getY(doc));
        doc.text('Station    :', this.x, getY(doc));
        doc.text('', this.x, getY(doc));
        doc.text(`X=${coordinates.x}`, this.x, getY(doc));
        doc.text(`Y=${coordinates.y}`, this.x, getY(doc));
        doc.text('', this.x, getY(doc));
        doc.text('------------------------------  ZIELORT  --------------------------------', this.x, getY(doc));
        doc.text(`Straße     : ${value.zielort.strasse}	Haus-Nr.: ${value.zielort.hnr}`, this.x, getY(doc));
        doc.text(`Ort        : ${value.zielort.ort}`, this.x, getY(doc));
        doc.text(`Objekt     : ${value.zielort.objekt}`, this.x, getY(doc));
        doc.text(`Station    :`, this.x, getY(doc));
        doc.text('', this.x, getY(doc));
        doc.text('------------------------------  PATIENT  --------------------------------', this.x, getY(doc));
        this.insertParagraph(doc, value.patient, getY);
        doc.text('------------------------------  EINSATZGRUND  ---------------------------', this.x, getY(doc));
        doc.text(`Schlagw.   : ${value.einsatzgrund.schlagwort}`, this.x, getY(doc));
        doc.text(`Stichwort  : ${value.einsatzgrund.stichwort}`, this.x, getY(doc));
        doc.text('', this.x, getY(doc));
        if (value.einsatzmittel.length > 0) {
          doc.text('------------------------------  EINSATZMITTEL  --------------------------', this.x, getY(doc));
          for (let einsatzmittel of value.einsatzmittel) {
            doc.text(`Name       : ${einsatzmittel.name}`, this.x, getY(doc));
            doc.text(`Alarmiert  : ${einsatzmittel.alarmiert}`, this.x, getY(doc));
            doc.text(`Aus        : ${einsatzmittel.aus}`, this.x, getY(doc));
          }
        }
        doc.text('', this.x, getY(doc));
        doc.text('------------------------------  BEMERKUNG  ------------------------------  ', this.x, getY(doc));
        this.insertParagraph(doc, value.bemerkung, getY);
        doc.text('--------------------------  ALARMFAX ENDE  ------------------------------', this.x, getY(doc));
        doc.text('', this.x, getY(doc));
        doc.text('Rechtlicher Hinweis:', this.x, getY(doc));
        doc.text('Die Inhalte dieses Faxes, insbesondere personenbezogene Daten, dürfen', this.x, getY(doc));
        doc.text('ausschließlich für einsatzbezogene Zwecke verwendet werden. Der Empfänger', this.x, getY(doc));
        doc.text('hat sicherzustellen, dass unbefugte Dritte keinen Zugang zu diesen', this.x, getY(doc));
        doc.text('Informationen erhalten.', this.x, getY(doc));

        return doc.output('blob');
      })
    )
  }

  private addWaterMark(doc: jsPDF) {
    const oldConfig = {
      font: doc.getFont(),
      textColor: doc.getTextColor(),
      fontSize: doc.getFontSize()
    }

    doc.setFont("courier", "normal");
    doc.setTextColor('#dfdfdf');
    doc.setFontSize(90)

    doc.text('ÜBUNGS-FAX', 50, 230, undefined, 45);

    doc.setFont(oldConfig.font.fontName);
    doc.setTextColor(oldConfig.textColor);
    doc.setFontSize(oldConfig.fontSize)
  }

  /**
   * Inserts the given paragraph and ensures that at least three lines are used.
   * @param doc
   * @param paragraph 
   * @param getY
   */
  private insertParagraph(doc: jsPDF, paragraph: string, getY: (doc: jsPDF) => number) {
    let filledValue = paragraph || '';
    while (filledValue.split('\n').length < 4) {
      filledValue += '\n';
    }
    doc.text(filledValue, this.x, getY(doc));
    for (let i = 1; i < (filledValue || '').split('\n').length; i++) {
      getY(doc);
    }
  }

  public generateDownloadFilename(): string {
    const date = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return `Übungs-Fax ${date}.pdf`;
  }
}
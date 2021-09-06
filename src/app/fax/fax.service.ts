import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class FaxService {

  private _y = 25;

  private readonly x = 20;

  private getY(doc: jsPDF): number {
    if (this._y > doc.internal.pageSize.height - 30) {
      doc.addPage();
      this.addWaterMark(doc);
      this._y = 25;
    }
    return this._y += 4.5;
  }

  constructor() { }

  public generateFax(value: any): Blob {
    this._y = 25;
    const doc = new jsPDF();

    doc.setFont("courier", "normal");
    doc.setTextColor('#000000');
    doc.setFontSize(11)

    this.addWaterMark(doc);

    doc.text("------ FAX ------ FAX ------ FAX ------ FAX ------ FAX ------ FAX -------", this.x, this.getY(doc));
    doc.text("Absender   : ILS MITTELFRANKEN SÜD", this.x, this.getY(doc));
    doc.text(`Fax        : +49  (${this.random(4)}) / ${this.random(7)}`, this.x, this.getY(doc));
    doc.text("Termin     :", this.x, this.getY(doc));
    doc.text(`Einsatznummer: T ${this.random()}.${this.random()} ${this.random(6)} ${this.random(2)}`, this.x, this.getY(doc));
    doc.text('------------------------------  MITTEILER  ------------------------------', this.x, this.getY(doc));
    this.insertParagraph(doc, value.mitteiler);
    doc.text('------------------------------  EINSATZORT  -----------------------------', this.x, this.getY(doc));
    doc.text(`Straße     : ${value.einsatzort.strasse}`, this.x, this.getY(doc));
    doc.text(`Haus-Nr.   : ${value.einsatzort.hnr}`, this.x, this.getY(doc));
    doc.text(`Ort        : ${value.einsatzort.ort}`, this.x, this.getY(doc));
    doc.text(`Objekt     : ${value.einsatzort.objekt}`, this.x, this.getY(doc));
    doc.text('Station    :', this.x, this.getY(doc));
    doc.text('', this.x, this.getY(doc));
    doc.text('X=', this.x, this.getY(doc));
    doc.text('Y=', this.x, this.getY(doc));
    doc.text('', this.x, this.getY(doc));
    doc.text('------------------------------  ZIELORT  --------------------------------', this.x, this.getY(doc));
    doc.text(`Straße     : ${value.zielort.strasse}	Haus-Nr.: ${value.zielort.hnr}`, this.x, this.getY(doc));
    doc.text(`Ort        : ${value.zielort.ort}`, this.x, this.getY(doc));
    doc.text(`Objekt     : ${value.zielort.objekt}`, this.x, this.getY(doc));
    doc.text(`Station    :`, this.x, this.getY(doc));
    doc.text('', this.x, this.getY(doc));
    doc.text('------------------------------  PATIENT  --------------------------------', this.x, this.getY(doc));
    this.insertParagraph(doc, value.patient);
    doc.text('------------------------------  EINSATZGRUND  ---------------------------', this.x, this.getY(doc));
    doc.text(`Schlagw.   : ${value.einsatzgrund.schlagwort}`, this.x, this.getY(doc));
    doc.text(`Stichwort  : ${value.einsatzgrund.stichwort}`, this.x, this.getY(doc));
    doc.text('', this.x, this.getY(doc));
    if (value.einsatzmittel.length > 0) {
      doc.text('------------------------------  EINSATZMITTEL  --------------------------', this.x, this.getY(doc));
      for (let einsatzmittel of value.einsatzmittel) {
        doc.text(`Name       : ${einsatzmittel.name}`, this.x, this.getY(doc));
        doc.text(`Alarmiert  : ${einsatzmittel.alarmiert}`, this.x, this.getY(doc));
        doc.text(`Aus        : ${einsatzmittel.aus}`, this.x, this.getY(doc));
      }
    }
    doc.text('', this.x, this.getY(doc));
    doc.text('------------------------------  BEMERKUNG  ------------------------------  ', this.x, this.getY(doc));
    this.insertParagraph(doc, value.bemerkung);
    doc.text('--------------------------  ALARMFAX ENDE  ------------------------------', this.x, this.getY(doc));
    doc.text('', this.x, this.getY(doc));
    doc.text('Rechtlicher Hinweis:', this.x, this.getY(doc));
    doc.text('Die Inhalte dieses Faxes, insbesondere personenbezogene Daten, dürfen', this.x, this.getY(doc));
    doc.text('ausschließlich für einsatzbezogene Zwecke verwendet werden. Der Empfänger', this.x, this.getY(doc));
    doc.text('hat sicherzustellen, dass unbefugte Dritte keinen Zugang zu diesen', this.x, this.getY(doc));
    doc.text('Informationen erhalten.', this.x, this.getY(doc));

    return doc.output('blob');
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
   */
  private insertParagraph(doc: jsPDF, paragraph: string) {
    let filledValue = paragraph || '';
    while (filledValue.split('\n').length < 4) {
      filledValue += '\n';
    }
    doc.text(filledValue, this.x, this.getY(doc));
    for (let i = 1; i < (filledValue || '').split('\n').length; i++) {
      this.getY(doc);
    }
  }

  /**
   * @param length 
   * @returns a string of the given length containing random numbers
   */
  private random(length = 1): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  public deserialize(param: string): any {
    return JSON.parse(decodeURI(param));
  }

  public serialize(input: object): string {
    let first = true;
    return encodeURI(JSON.stringify(input, (k, v) => {
      if (first) {
        first = false;
      } else if (!this.hasContent(v)) {
        return undefined;
      }
      return v;
    }));
  }

  private hasContent(obj: any): boolean {
    if (obj === '') {
      return false;
    } else if (obj === null) {
      return false;
    } else if (obj === undefined) {
      return false;
    } else if (Array.isArray(obj) && obj.length === 0) {
      return false;
    } else if (typeof obj === 'object') {
      return Object.values(obj).some(prop => this.hasContent(prop));
    }
    return true;
  }

  public generateDownloadFilename(): string {
    const date = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return `Übungs-Fax ${date}.pdf`;
  }
}
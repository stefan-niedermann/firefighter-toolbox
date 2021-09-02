import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class FaxService {

  private _y = 25;

  private readonly x = 20;
  private get y() {
    return this._y += 4.5;
  }

  constructor() { }

  public generateFax(value: any): Blob {
    this._y = 25;
    var doc = new jsPDF();

    doc.setFont("courier", "normal");
    doc.setTextColor('#dfdfdf');
    doc.setFontSize(90)
    doc.text('ÜBUNGS-FAX', 50, 230, undefined, 45);

    doc.setTextColor('#000000');
    doc.setFontSize(11)
    doc.text("------ FAX ------ FAX ------ FAX ------ FAX ------ FAX ------ FAX -------", this.x, this.y);
    doc.text("Absender   : ILS MITTELFRANKEN SÜD", this.x, this.y);
    doc.text(`Fax        : +49  (${this.random(4)}) / ${this.random(7)}`, this.x, this.y);
    doc.text("Termin     :", this.x, this.y);
    doc.text(`Einsatznummer: T ${this.random()}.${this.random()} ${this.random(6)} ${this.random(2)}`, this.x, this.y);
    doc.text('------------------------------  MITTEILER  ------------------------------', this.x, this.y);
    doc.text(value.mitteiler, this.x, this.y);
    for (let i = 1; i < (value.mitteiler || '').split('\n').length; i++) {
      this.y;
    }
    doc.text('------------------------------  EINSATZORT  -----------------------------', this.x, this.y);
    doc.text(`Straße     : ${value.einsatzort.strasse}`, this.x, this.y);
    doc.text(`Haus-Nr.   : ${value.einsatzort.hnr}`, this.x, this.y);
    doc.text(`Ort        : ${value.einsatzort.ort}`, this.x, this.y);
    doc.text(`Objekt     : ${value.einsatzort.objekt}`, this.x, this.y);
    doc.text('Station    :', this.x, this.y);
    doc.text('', this.x, this.y);
    doc.text('X=', this.x, this.y);
    doc.text('Y=', this.x, this.y);
    doc.text('', this.x, this.y);
    doc.text('------------------------------  ZIELORT  --------------------------------', this.x, this.y);
    doc.text(`Straße     : ${value.zielort.strasse}	Haus-Nr.: ${value.zielort.hnr}`, this.x, this.y);
    doc.text(`Ort        : ${value.zielort.ort}`, this.x, this.y);
    doc.text(`Objekt     : ${value.zielort.objekt}`, this.x, this.y);
    doc.text(`Station    :`, this.x, this.y);
    doc.text('', this.x, this.y);
    doc.text('------------------------------  PATIENT  --------------------------------', this.x, this.y);
    doc.text(value.patient, this.x, this.y);
    for (let i = 1; i < (value.patient || '').split('\n').length; i++) {
      this.y;
    }
    doc.text('------------------------------  EINSATZGRUND  ---------------------------', this.x, this.y);
    doc.text(`Schlagw.   : ${value.einsatzgrund.schlagwort}`, this.x, this.y);
    doc.text(`Stichwort  : ${value.einsatzgrund.stichwort}`, this.x, this.y);
    doc.text('', this.x, this.y);
    if (value.einsatzmittel.length > 0) {
      doc.text('------------------------------  EINSATZMITTEL  --------------------------', this.x, this.y);
      for (let einsatzmittel of value.einsatzmittel) {
        doc.text(`Name       : ${einsatzmittel.name}`, this.x, this.y);
        doc.text(`Alarmiert  : ${einsatzmittel.alarmiert}`, this.x, this.y);
        doc.text(`Aus        : ${einsatzmittel.aus}`, this.x, this.y);
      }
    }
    doc.text('', this.x, this.y);
    doc.text('------------------------------  BEMERKUNG  ------------------------------  ', this.x, this.y);
    doc.text(value.bemerkung, this.x, this.y);
    for (let i = 1; i < (value.bemerkung || '').split('\n').length; i++) {
      this.y;
    }
    doc.text('--------------------------  ALARMFAX ENDE  ------------------------------', this.x, this.y);
    doc.text('', this.x, this.y);
    doc.text('Rechtlicher Hinweis:', this.x, this.y);
    doc.text('Die Inhalte dieses Faxes, insbesondere personenbezogene Daten, dürfen', this.x, this.y);
    doc.text('ausschließlich für einsatzbezogene Zwecke verwendet werden. Der Empfänger', this.x, this.y);
    doc.text('hat sicherzustellen, dass unbefugte Dritte keinen Zugang zu diesen', this.x, this.y);
    doc.text('Informationen erhalten.', this.x, this.y);

    return doc.output('blob');
  }

  private random(number = 1): string {
    let result = '';
    for (let i = 0; i < number; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}
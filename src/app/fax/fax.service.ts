import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { map, Observable } from 'rxjs';
import { NominatimService } from './nominatim.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class FaxService {

  public readonly QUERY_PARAM_KEY = 'content';
  private readonly MODEL_VERSION = 1;
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
          if (y > doc.internal.pageSize.height - 25) {
            doc.addPage();
            FaxService.addWaterMark(doc);
            y = 25;
          }
          return y += 4.5;
        }

        const doc = new jsPDF({
          compress: true,
          putOnlyUsedFonts: true
        });

        doc.setFont("courier", "normal");
        doc.setTextColor('#000000');
        doc.setFontSize(11)

        FaxService.addWaterMark(doc);

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

  private static addWaterMark(doc: jsPDF) {
    const oldConfig = {
      font: doc.getFont(),
      textColor: doc.getTextColor(),
      fontSize: doc.getFontSize()
    }

    doc.setFont("courier", "normal");
    doc.setTextColor('#dfdfdf');
    doc.setFontSize(90)

    doc.text('ÜBUNGS-FAX', 45, 225, undefined, 45);

    doc.setFont(oldConfig.font.fontName);
    doc.setTextColor(oldConfig.textColor);
    doc.setFontSize(oldConfig.fontSize)
  }

  private insertParagraph(doc: jsPDF, paragraph: undefined | string, getY: (doc: jsPDF) => number) {
    const preparedText = [(paragraph || '')]
      .map(p => this.utils.breakLongLines(p))
      .map(p => this.utils.ensureMinimumLineCount(p))
      .shift() as string;

    doc.text(preparedText, this.x, getY(doc));

    for (let i = 1; i < preparedText.split('\n').length; i++) {
      getY(doc);
    }
  }

  public generateDownloadFilename(): string {
    const date = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return `Übungs-Fax ${date}.pdf`;
  }

  public generateShareLink(payload: any): string {
    return `${location.protocol}//${location.host}${location.pathname}?${this.QUERY_PARAM_KEY}=${this.serialize(payload)}`
  }

  public deserialize(param: string, decode = true): SerializationModel {
    const data = JSON.parse(
      decode
        ? decodeURI(param)
        : param
    );

    const model: SerializationModel = {};

    if (!data) {
      return model;
    }

    const payload = data.payload;

    if (!payload) {
      return model;
    }

    if (
      typeof data.v !== 'number' ||
      data.v <= 0 ||
      data.v > this.MODEL_VERSION
    ) {
      throw new Error(`Model version ${data.v} is not supported. Current model version: ${this.MODEL_VERSION}`);
    }

    if (data.v === 1) {
      if (typeof payload.mitteiler === 'string') {
        model.mitteiler = payload.mitteiler;
      }
      if (typeof payload.einsatzort === 'object') {
        const address: Address = {};
        ['strasse', 'hnr', 'ort', 'objekt'].forEach(key => {
          if (typeof payload.einsatzort[key] === 'string') {
            (address as any)[key] = payload.einsatzort[key];
          }
        });
        if (Object.keys(address).length > 0) {
          model.einsatzort = address;
        }
      }
      if (typeof payload.zielort === 'object') {
        const address: Address = {};
        ['strasse', 'hnr', 'ort', 'objekt'].forEach(key => {
          if (typeof payload.zielort[key] === 'string') {
            (address as any)[key] = payload.zielort[key];
          }
        });
        if (Object.keys(address).length > 0) {
          model.zielort = address;
        }
      }
      if (typeof payload.patient === 'object') {
        model.patient = payload.patient;
      }
      if (Array.isArray(payload.einsatzmittel)) {
        model.einsatzmittel = (data.payload.einsatzmittel as []).map((e: any) => {
          const einsatzmittel: Einsatzmittel = {};
          if (typeof e.name === 'string') {
            einsatzmittel.name = e.name;
          }
          if (typeof e.alarmiert === 'string') {
            einsatzmittel.alarmiert = e.alarmiert;
          }
          if (typeof e.aus === 'string') {
            einsatzmittel.aus = e.aus;
          }
          return einsatzmittel;
        });
      }
      if (typeof payload.bemerkung === 'object') {
        model.bemerkung = payload.bemerkung;
      }
      if (typeof payload.einsatzgrund === 'object') {
        const einsatzgrund: Einsatzgrund = {};
        if (typeof payload.einsatzgrund.schlagwort === 'string') {
          einsatzgrund.schlagwort = payload.einsatzgrund.schlagwort;
        }
        if (typeof payload.einsatzgrund.stichwort === 'string') {
          einsatzgrund.stichwort = payload.einsatzgrund.stichwort;
        }
        if (Object.keys(einsatzgrund).length > 0) {
          model.einsatzgrund = einsatzgrund;
        }
      }
    }

    return model;
  }

  public serialize(payload: any, encode = true): string {
    let first = true;
    const serializedParams = JSON.stringify({
      v: this.MODEL_VERSION,
      payload: {
        mitteiler: payload.mitteiler,
        einsatzort: {
          strasse: payload.einsatzort?.strasse,
          hnr: payload.einsatzort?.hnr,
          objekt: payload.einsatzort?.objekt,
          ort: payload.einsatzort?.ort,
        },
        zielort: {
          strasse: payload.zielort?.strasse,
          hnr: payload.zielort?.hnr,
          objekt: payload.zielort?.objekt,
          ort: payload.zielort?.ort,
        },
        patient: payload.patient,
        einsatzmittel: Array.isArray(payload.einsatzmittel)
          ? payload.einsatzmittel.map((e: any) => {
            return {
              name: e.name,
              alarmiert: e.alarmiert,
              aus: e.aus,
            }
          }) : [],
        bemerkung: payload.bemerkung,
        einsatzgrund: {
          schlagwort: payload.einsatzgrund?.schlagwort,
          stichwort: payload.einsatzgrund?.stichwort
        }
      }
    }, (k, v) => {
      if (first) {
        first = false;
      } else if (!this.utils.hasContent(v)) {
        return undefined;
      }
      return v;
    });
    return encode
      ? encodeURI(serializedParams)
      : serializedParams;
  }
}

export interface SerializationModel {
  mitteiler?: string,
  einsatzort?: Address,
  zielort?: Address,
  patient?: string,
  einsatzgrund?: Einsatzgrund,
  einsatzmittel?: Einsatzmittel[],
  bemerkung?: string,
}

export interface Einsatzgrund {
  schlagwort?: string,
  stichwort?: string,
}

export interface Address {
  strasse?: string,
  hnr?: string,
  objekt?: string,
  ort?: string,
}

export interface Einsatzmittel {
  name?: string,
  alarmiert?: string,
  aus?: string,
}
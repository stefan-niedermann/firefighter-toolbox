import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  private readonly persistenceKey = 'nominatim';
  private readonly persistenceValue = 'enabled';
  private readonly defaultCoordinates: Coordinates = {
    x: '51.344000',
    y: '10.459000'
  }

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public toggle() {
    if (this.isEnabled()) {
      localStorage.removeItem(this.persistenceKey);
    } else {
      localStorage.setItem(this.persistenceKey, this.persistenceValue);
    }
  }

  public isEnabled(): boolean {
    return localStorage.getItem(this.persistenceKey) === this.persistenceValue;
  }

  public getCoordinates(address: any): Observable<Coordinates> {
    if (this.isEnabled()) {
      const params = new HttpParams()
        .append('street', `${address.hnr} ${address.strasse}`)
        .append('city', address.ort)
        .append('countrycodes', 'de')
        .append('limit', 1)
        .append('format', 'json');
      return this.httpClient.get('https://nominatim.openstreetmap.org/search', { params })
        .pipe(map((response) => {
          return (Array.isArray(response) && response.length > 0)
            ? {
              x: (response as any)[0].lat,
              y: (response as any)[0].lon
            }
            : this.defaultCoordinates
        }))
    } else {
      return of(this.defaultCoordinates);
    }
  }
}

export interface Coordinates {
  x: string,
  y: string
}
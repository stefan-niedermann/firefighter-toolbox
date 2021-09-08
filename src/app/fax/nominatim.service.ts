import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  private isEnabled$ = new ReplaySubject<boolean>();

  constructor(
    private readonly httpClient: HttpClient
  ) {
    this.isEnabled$.next(localStorage.getItem('nominatim') === 'enabled');
  }

  public setStatus(enabled = true) {
    if (enabled) {
      localStorage.setItem('nominatim', 'enabled');
      this.isEnabled$.next(true);
    } else {
      localStorage.removeItem('nominatim');
      this.isEnabled$.next(false);
    }
  }

  public isEnabled(): Observable<boolean> {
    return this.isEnabled$.asObservable();
  }

  public getCoordinates(address: any): Observable<Coordinates> {
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
          : {
            x: '',
            y: ''
          }
      }))
  }
}

export interface Coordinates {
  x: string,
  y: string
}
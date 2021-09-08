import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  /**
   * @param length 
   * @returns a string of the given length containing random numbers
   */
  public random(length = 1): string {
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
}

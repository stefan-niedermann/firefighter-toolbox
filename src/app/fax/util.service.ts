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

  public hasContent(obj: any): boolean {
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

  public breakLongLines(paragraph: string, maxLineLength = 73): string {
    return paragraph
      .split('\n')
      .map(line => this.breakLongLine(line, maxLineLength).join('\n'))
      .join('\n');
  }

  private breakLongLine(line: string, maxLineLength: number): string[] {
    if (line.length <= maxLineLength) {
      return [line];
    }

    const lastSpaceInLine = line.substring(0, maxLineLength).lastIndexOf(' ');
    return (lastSpaceInLine === -1)
      ? [
        line.substring(0, maxLineLength),
        ...this.breakLongLine(line.substring(maxLineLength, line.length), maxLineLength)
      ]
      : [
        line.substring(0, lastSpaceInLine),
        ...this.breakLongLine(line.substring(lastSpaceInLine + 1, line.length), maxLineLength)
      ]
  }

  public ensureMinimumLineCount(paragraph: string, count = 4): string {
    let lineCount = paragraph.split('\n').length;
    while (lineCount < count) {
      paragraph += '\n';
      lineCount++;
    }
    return paragraph;
  }
}

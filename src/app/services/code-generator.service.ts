import { Injectable } from '@angular/core';
import { ReplaySubject, timer } from 'rxjs';

import { Payment } from '../shared/models/payment';

@Injectable({
  providedIn: 'root'
})
export class CodeGeneratorService {
  letter = null;
  grid = [];
  grid$ = new ReplaySubject<any>(1);
  code = null;
  code$ = new ReplaySubject<number>(1);
  started = false;
  timer$ = timer(0, 2000);
  timerShort$ = timer(0, 100);
  time = 0;
  time$ = new ReplaySubject<number>(1);
  payments = [];
  payments$ = new ReplaySubject<Payment[]>(1);

  constructor() { }

  getGrid() {
    return this.grid$;
  }

  getCode() {
    return this.code$;
  }

  getTime() {
    return this.time$;
  }

  getPayments() {
    return this.payments$;
  }

  setLetter(letter: string) {
    this.letter = letter;
  }

  addPayment(payment) {
    this.payments.push(payment);
    this.payments$.next(this.payments);
  }

  startGeneration() {
    if (!this.started) {
      this.timer$.subscribe(() => {
        this.generateCode(this.letter);
      });
      this.timerShort$.subscribe(() => {
        this.time = (this.time >= 1.9) ? 0 : +(this.time += 0.1).toFixed(1);
        this.time$.next(this.time);
      });
      this.started = true;
    }
  }

  generateCode(weightLetter?: string) {
    const time = new Date().getSeconds();
    const digitA = Math.floor(time / 10);
    const digitB = time % 10;
    let gridArray: any[];
    if (weightLetter) {
      gridArray = this.createGridWithLetter(weightLetter);
    } else {
      gridArray = this.createGridWithoutLetter();
    }
    const letter1 = gridArray[digitA][digitB];
    const letter2 = gridArray[digitB][digitA];
    const codeDigit1 = this.createCodeDigit(gridArray, letter1);
    const codeDigit2 = this.createCodeDigit(gridArray, letter2);
    this.grid = gridArray;
    this.grid$.next(this.grid);
    this.code = codeDigit1 * 10 + codeDigit2;
    this.code$.next(this.code);
  }

  createGridWithLetter(letter) {
    const gridArray = [];
    for (let i = 1; i <= 8; i++) {
      const newRow = [];
      for (let j = 1; j <= 10; j++) {
        const cell = Math.floor(Math.random() * 26) + 97;
        newRow.push(String.fromCharCode(cell));
      }
      gridArray.push(newRow);
    }
    for (let i = 1; i <= 2; i++) {
      const newRow = [];
      for (let j = 1; j <= 10; j++) {
        newRow.push(letter);
      }
      gridArray.push(newRow);
    }
    const flatArray = [].concat(...gridArray);
    this.shuffle(flatArray);
    const shuffledArray = [];
    while (flatArray.length) {
      shuffledArray.push(flatArray.splice(0, 10));
    }
    return  shuffledArray;
  }

  createGridWithoutLetter() {
    const gridArray = [];
    for (let i = 1; i <= 10; i++) {
      const newRow = [];
      for (let j = 1; j <= 10; j++) {
        const cell = Math.floor(Math.random() * 26) + 97;
        newRow.push(String.fromCharCode(cell));
      }
      gridArray.push(newRow);
    }
    return gridArray;
  }

  createCodeDigit(gridArray, letter) {
    let letterCount = 0;
    gridArray.forEach(row => {
      row.forEach( value => {
        if (letter === value) {
          letterCount++;
        }
      });
    });
    let codeDigit: number;
    if (letterCount > 9) {
      codeDigit = Math.ceil(letterCount / (Math.floor(letterCount / 10) + 1));
    } else {
      codeDigit = letterCount;
    }
    return codeDigit;
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}

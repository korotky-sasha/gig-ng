import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CodeGeneratorService } from '../../services/code-generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  grid$ = this.codeGeneratorService.getGrid();
  grid = [];
  code$ = this.codeGeneratorService.getCode();
  letter = null;
  started = false;
  timerShort$ = timer(0, 100);
  time$ = this.codeGeneratorService.getTime();
  time = 0;

  constructor(
    private router: Router,
    private codeGeneratorService: CodeGeneratorService
  ) { }

  ngOnInit() {
    this.createEmptyGrid();
    this.grid$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
      this.grid = value;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createEmptyGrid() {
    for (let i = 1; i <= 10; i++) {
      const newRow = [];
      for (let j = 1; j <= 10; j++) {
        newRow.push('');
      }
      this.grid.push(newRow);
    }
  }

  startGeneration() {
    if (!this.started) {
      this.codeGeneratorService.startGeneration();
      /*this.timerShort$.subscribe(() => {
        this.time = (this.time >= 1.9) ? 0 : +(this.time += 0.1).toFixed(1);
      });*/
      this.started = true;
    }
  }

  setLetter(event) {
    if (event.target.validity.valid) {
      this.letter = event.data;
      this.codeGeneratorService.setLetter(this.letter);
      event.target.disabled = true;
      setTimeout(() => {
        event.target.disabled = false;
      }, 4000);
    } else {
      event.target.value = this.letter ? this.letter : '';
    }
  }

  goToPayments() {
    this.router.navigate(['./payments']).then(() => {});
  }

}

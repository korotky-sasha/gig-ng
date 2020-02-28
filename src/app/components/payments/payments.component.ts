import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CodeGeneratorService } from '../../services/code-generator.service';
import { Payment } from '../../shared/models/payment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  form: FormGroup;
  payments: Payment[] = [];
  payments$ = this.codeGeneratorService.getPayments();
  grid$ = this.codeGeneratorService.getGrid();
  grid = [];
  code$ = this.codeGeneratorService.getCode();
  code = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private codeGeneratorService: CodeGeneratorService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.grid$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
      this.grid = value;
    });
    this.code$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        this.code = value;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  addPayment() {
    const newPayment: Payment = {
      name: this.form.value.name,
      amount: this.form.value.amount,
      code: this.code,
      grid: this.grid
    };
    this.payments.push(newPayment);
    this.codeGeneratorService.addPayment(newPayment);
  }

  goToGenerator() {
    this.router.navigate(['./generator']).then(() => {});
  }

}

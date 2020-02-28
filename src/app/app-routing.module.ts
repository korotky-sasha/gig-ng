import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneratorComponent } from './components/generator/generator.component';
import { PaymentsComponent } from './components/payments/payments.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'generator'
  },
  {
    path: 'generator',
    component: GeneratorComponent
  },
  {
    path: 'payments',
    component: PaymentsComponent
  },
  {
    path: '**',
    redirectTo: 'generator'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

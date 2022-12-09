import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { PlanComponent } from './plan/plan.component';
import { UsageComponent } from './usage/usage.component';

@NgModule({
  declarations: [PlanComponent, UsageComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }

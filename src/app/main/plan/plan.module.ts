import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { PlanDisplayComponent } from './display/display.component';
import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateComponent, PlanDisplayComponent, PlanComponent],
  imports: [
    CommonModule,
    PlanRoutingModule,
    FormsModule
  ]
})
export class PlanModule { }

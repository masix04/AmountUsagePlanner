import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { UsageDisplayComponent } from './display/display.component';
import { UsageComponent } from './usage.component';
import { UsageRoutingModule } from './usage-routing.module';
import { FormsModule } from '@angular/forms';
import { GetPlanComponent } from 'src/app/common/get-plan/get-plan.component';

@NgModule({
  declarations: [ManageComponent, UsageDisplayComponent, UsageComponent, GetPlanComponent],
  imports: [
    CommonModule,
    UsageRoutingModule,
    FormsModule
  ]
})
export class UsageModule { }

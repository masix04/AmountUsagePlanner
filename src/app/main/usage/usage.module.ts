import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { UsageDisplayComponent } from './display/display.component';

@NgModule({
  declarations: [ManageComponent, UsageDisplayComponent],
  imports: [
    CommonModule
  ]
})
export class UsageModule { }

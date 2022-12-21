import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UsageDisplayComponent } from './display/display.component';
import { UsageComponent } from './usage.component';

const routes: Routes = [

  { path: '', component: UsageComponent,
    children: [
      { path: 'manage-spent', component: ManageComponent },
      { path: 'display-spent', component: UsageDisplayComponent },
      { path: '', redirectTo: 'manage-spent', pathMatch: 'full' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsageRoutingModule { }

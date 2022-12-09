import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { PlanDisplayComponent } from './display/display.component';
import { PlanComponent } from './plan.component';

const routes: Routes = [

  { path: '', component: PlanComponent,
    children: [
      { path: 'create-plan', component: CreateComponent },
      { path: 'display-plan', component: PlanDisplayComponent },
      { path: '', redirectTo: 'create-plan', pathMatch: 'full' }
    ] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }

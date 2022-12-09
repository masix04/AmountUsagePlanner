import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'home', component: MainComponent },

  { path: 'plan', loadChildren: './main/plan/plan.module#PlanModule' },
  // { path: 'plan/display-plan', loadChildren: './main/plan/plan.module#PlanModule' },

  { path: 'usage', loadChildren: './main/usage/usage.module#UsageModule' },
  // { path: 'usage/display-usage', loadChildren: './main/usage/usage.module#UsageModule' },


  // { path: 'plan/create-plan', component: CreateComponent },
  // { path: 'plan/display-plan', component: PlanDisplayComponent },

  // { path: 'usage/manage-usage', component: ManageComponent},
  // { path: 'usage/display-usage', component:  UsageDisplayComponent},

  /** WildCard Route for 404 Page */
  { path: '**', component: MainComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

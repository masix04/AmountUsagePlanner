import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { FusionChartsModule } from 'angular-fusioncharts';
import *as FusionCharts from 'fusioncharts';
import *as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import *as Maps from 'fusioncharts/fusioncharts.maps';

FusionChartsModule.fcRoot(FusionCharts,Maps, Charts, FusionTheme)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FusionChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

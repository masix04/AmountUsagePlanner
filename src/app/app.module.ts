import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { FusionChartsModule } from 'angular-fusioncharts';
import *as FusionCharts from 'fusioncharts';
import *as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import *as Maps from 'fusioncharts/fusioncharts.maps';

import { HelperService } from './helperService/helper.service';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app-routing.module'; /** For app /root routing */

FusionChartsModule.fcRoot(FusionCharts,Maps, Charts, FusionTheme)

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FusionChartsModule,
    HttpClientModule,
    AppRoutingModule /** For app /root routing */
  ],
  providers: [HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }

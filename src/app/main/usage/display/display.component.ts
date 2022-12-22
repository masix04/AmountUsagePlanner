import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { HelperService } from '../../../helperService/helper.service';
import { SharedService } from '../../../helperService/shared.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css', './../../../app.component.css']
})
export class UsageDisplayComponent implements OnInit {

  PLANNED_WHAT: any;

  CHART_DATA: any;
  usedData: any;
  usedSeparatly: any;
  dataKeys: any;

  planVisualizeTable: any;

  months: any;
  years: any;
  _MONTH: any;
  _YEAR: any;

  innerWidth: any;

  isData: any;
  isStart: any;

  @ViewChild('month') _selected_month: any;
  @ViewChild('year') _selected_year: any;
  @ViewChild('NoDataNotification') _no_data_notify: any; /** Un Used */

  constructor(public helperService: HelperService, public sharedService: SharedService) {
    this.isStart = true;

    this.dataKeys = [];
    this.resetToDefaults();

    this.planVisualizeTable = false;
    this.isData = false;

    this.getScreenWidth();
    this.getStoredMonthsAndYear();
  }

  resetToDefaults() {
    this.usedSeparatly = {
      'used_amount': [],
      'used_percentage': [],
      'remain_percentage': [],
      'plan_percentage': []
    };
    this.dataKeys = [];
  }

  ngOnInit() {
    this.PLANNED_WHAT = this.sharedService.getPlanWhat();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenWidth();
  }
  getScreenWidth() {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth);
  }

  getStoredMonthsAndYear()
  {
    this.months = this.sharedService.getSavedMonths(); this.months = this.months.split(',');
    this.years = this.sharedService.getSavedYears(); this.years = this.years.split(',');
  }

  resetSelections()
  {
    this._selected_month.nativeElement.value = null;
    this._selected_year.nativeElement.value = null;
  }

  displayHideTable()
  {
    this.isStart = false;
    if(this.planVisualizeTable == true) {
      this.planVisualizeTable = false;
      this.resetToDefaults();
      this.resetSelections();
    } else {
      this.planVisualizeTable = true;
      this.getUsed();
      this.isData = true;
    }
  }

  getUsed() {
      let data = {
        'month' : this._MONTH,
        'year' : this._YEAR
      };
      this.helperService.getUsage(data).subscribe({
          next: (response) => {
            this.usedData = response['AmountPlanner'].Used.data;
            // console.log(this.usedData);
            this.AmountAgainstPercentages();
          },
          error: (error) => {
            console.log('error: ' + error);
            this.isData = false;
          }
      });
  }

  AmountAgainstPercentages() {
    let month = Object.keys(this.usedData);
    let used: any = Object.values(this.usedData)[0];
    // console.log(this.usedSeparatly);

    used.forEach((value:any, key:any) => {
      this.usedSeparatly['used_amount'][value['key_name']] = value['used_amount'];
      this.usedSeparatly['used_percentage'][value['key_name']] = value['used_percentage'];
      this.usedSeparatly['remain_percentage'][value['key_name']] = value['remaining_percentage'];
      this.usedSeparatly['plan_percentage'][value['key_name']] = value['planned_percentage'];
    });
    console.log(this.usedSeparatly);
    this.extractKeys(this.usedSeparatly['used_percentage']);
  }

  extractKeys(data: any) {
    this.dataKeys = [];
    /** Keys are Separating */
    this.dataKeys = Object.keys(data);
    console.log(this.dataKeys);
  }

  fillChartData(data :any, type: any) {

    if(type == 'category') {
        data.forEach((element: any) => {
            this.CHART_DATA['category'].push( {'label' : Object.keys(element)[0] });
        });
    }
    else if(type == 'planned') {
        data.forEach((element: any) => {
            this.CHART_DATA['planned_data'].push( {'value' : Object.values(element)[0] });
        });
    }
    else if(type == 'used') {
        data.forEach((element: any) => {
            this.CHART_DATA['used_data'].push( {'value' : Object.values(element)[1] });
        });
    }
    else if(type == 'remaining') {
      data.forEach((element: any) => {
          this.CHART_DATA['remaining_data'].push( {'value' : Object.values(element)[2] });
      });
    }

   // console.log('CHART_DATA');
   // console.log(this.CHART_DATA);

  }
  ngAfterViewInit() {}
}

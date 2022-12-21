import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { HelperService } from '../../../helperService/helper.service';
import { SharedService } from '../../../helperService/shared.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css', './../../../app.component.css']
})
export class PlanDisplayComponent implements OnInit {

  title = 'amount-usage-planner';
  PLAN_WHAT = '';
  Amount = 0;

  _DATE = new Date();
  _MONTH: any;

  step = 1;

  PlannedData: any;
  dataKeys = [];
  dataValues = [];

  months = [];
  monthsFromCurrent = [];

  plannedPercentages = [];
  percentagesSeparatly = [];

  remainAmount: any;
  remainPercentage: any;

  innerWidth: any;

  dataSource: any;

  KEY_SELECTED: any;
  SPENT_AMOUNT: any;

  visualizeChart = false;
  visualizeTable = false;
  planVisualizeTable = true;

  usedData: any;
  used_remain_percentages: any;
  used_remain_amounts: any;

  used_remain_percentages_DESKTOP: any;
  used_remain_amounts_DESKTOP: any;

  percent_display_selected = true; /** By-default Percentage SWITCH Icon Will be Shown, While Data in Amounts Shows */
  amount_display_selected = false;

  CHART_DATA: any;

  Table_shown = false; /** To show Month Selection OR Not */

  constructor(public helperService: HelperService, public http: HttpClient, public sharedService: SharedService) {
      this.setMostVariablesToDefault();
      this.getPlanned();
      this.getScreenWidth();
  }

  ngOnInit() {
  }

  setMostVariablesToDefault() {
      this.step = 1;
      this.visualizeChart = false;
      this.visualizeTable = false;
      this.percent_display_selected = true; /** Show 'Rs' Sign First then Percentage -> No matter from Which page it rerouted From */
      this.amount_display_selected = false; /** Show 'Rs' Sign First -> THIS was showing Both Changeable Modes */
      this.PlannedData = {
          'causes' : [],
          'percentages': [],
          'months': []
      }
      this.setChartArrayToDefault();
  }

  setChartArrayToDefault() {
      this.CHART_DATA = {
          "category" : [],
          "planned_data": [],
          "used_data": [],
          "remaining_data": []
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
      this.getScreenWidth();
  }
  getScreenWidth() {
    this.innerWidth = window.innerWidth;
//    console.log(this.innerWidth);
  }


  /** Toggle Chart Switches */
  displayTable() {
      this.planVisualizeTable = true;

      /** To Make MONTH OPTION Disable when Table is Shown */
      this.Table_shown = true;

      /** Make PlannedPercentage Array to fill with Data */
      /**           In Desktop, Required => Because Only Showing Planned Percentages in that Screen Size */
      // this.getUnPlannedPercentage();
  }
  hideTable() {
      this.planVisualizeTable = false;

      /** To Make MONTH OPTION Enable when Table is Hidden */
      this.Table_shown = false;

      /** Make Used Data to show in RS after hide Table */
      this.percent_display_selected = true;
      this.amount_display_selected = false;
  }

    /** Toggle SWITCH To Display Data in Either Percentages OR Amounts */
    displayTableData_Percentages() {
        this.amount_display_selected = true;
        this.percent_display_selected = false;
        this.extractKeysAndValues(this.used_remain_percentages['percentages'],'used');
    }
    displayTableData_Amounts() {
        this.percent_display_selected = true;
        this.amount_display_selected = false;
        this.extractKeysAndValues(this.used_remain_amounts['amounts'],'used');
    }

  getPlanned() {
    return this.http.get(this.helperService.BASE_URL + 'getPlanned.php').subscribe({
        next: (response) => {
            // console.log(response);
//            console.log(response['AmountPlanner'].Planned.data);
            this.plannedPercentages = response['AmountPlanner'].Planned.data;

                  /** Getting caused  */
            this.AmountAgainstPercentages();
            this.displayTable();
          },
        error: (error) => console.log(error)
    });
  }

  AmountAgainstPercentages() {

//    console.log("amountAgainstPercentages Function");
//    console.log(this.plannedPercentages);
//    console.log(this.PlannedData);
    this.plannedPercentages.forEach((value:any, key:any) => {
      this.PlannedData['causes'][value['key_name']] = value['planned_percentage'];
      // this.PlannedData['causes'][value['key_name']] = Math.ceil( (( value['planned_percentage'] / 100)) * this.Amount ); /** Get Usable-amount-for-given-%es According to the month selected */
        // console.log(key + ' - => ' + value['key_name'] + ' -- ==> ' + value['planned_percentage']);
    });
//    console.log('this.PlannedData');
//    console.log(this.PlannedData['causes']);
    this.extractKeysAndValues(this.PlannedData['causes'], 'planned');
  }

  /** For used DATA ---- NOT USABLE IN PLANNED DATA */
  // getUnPlannedPercentage() {
  //     let totalUsedPercentage = 0;
  //     this.percentagesSeparatly = []; /** Initialized to Empty */
  //     console.log(this.dataValues);
  //     this.plannedPercentages.forEach((value, key) => {
  //         totalUsedPercentage = totalUsedPercentage + parseInt(this.dataValues[key]);
  //         console.log(totalUsedPercentage);
  //         this.percentagesSeparatly.push(parseInt(this.dataValues[key]));
  //     });
  //    console.log(this.percentagesSeparatly);
  //     this.remainPercentage = 100 - totalUsedPercentage;
  //     this.remainAmount = ( (this.remainPercentage / 100) * this.Amount);
  //   console.log('remainAmount: '+this.remainAmount);
  //   console.log('remainPercentage: ' + this.remainPercentage);
  // }

  mergePecentagesWithPlannedData() {
      this.PlannedData['percentages'] = this.percentagesSeparatly;
      this.sharedService.storePlannedPercentages(this.PlannedData['percentages']); /** Stored to share b/w components  */
  }
  mergeMonthsWithPlannedData() {
      this.PlannedData['months'] = this.monthsFromCurrent;
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

  /** Get Data Values and Keys */
  extractKeysAndValues(data: any, amount_type='planned') {
    this.dataValues = [];
//    console.log('plannedData \|/'); console.log(this.PlannedData);
//    console.log('dataKeys \|/'); console.log(this.dataKeys);
//    console.log('data \|/'); console.log(data);

    if(amount_type == 'planned') {
      /** Separating Keys and Values from An array */
      this.plannedPercentages.forEach((value:any, key:any) => {

        /** Keys and Values are Separating */
        this.dataKeys.push(value['key_name']);
        this.dataValues.push(value['planned_percentage']);
      });

    }
    this.sharedService.storePlannedKeys(this.dataKeys);
//    console.log(this.dataKeys);
//    console.log(this.dataValues);
  }

  createChart(type :any) {

    /** Get Used Data first  */
    /** GET USED means Here - get Used Data Again
     *        CASE => If user adds an item and then checks what Used PLAN has been developed So need to get from DB Again for recent Data Addition
    */
      /** Fill chart according to requirement => eg: If planned then only show Planned Chart */
      this.fillChart();

     /** Dynamic Chart  */
     this.dataSource = {
      chart: {
        "caption": "My "+this.PLAN_WHAT+" Usage Planner",
        "subCaption": "Personal-E-Collection",
        "xAxisname": "Purpose chunks",
        "yAxisName": "Amount (In PKR)", /** Can be change in Future */
        // "numberPrefix": "",
        "exportenabled": "1",
        "theme": "fusion"
      },
      "categories": [
        {
          "category": this.CHART_DATA['category']
        }
      ],
      "dataset": [
        {
          "seriesName": "Planned Amount",
          "data": this.CHART_DATA['planned_data']
        },
        {
          "seriesName": "Amount Used",
          "renderAs": "line",
          "data": this.CHART_DATA['used_data']
        },
        {
          "seriesName": "Remaining Amount",
          "renderAs": "area",
          "showAnchors" : "0",
          "data": this.CHART_DATA['remaining_data']
        }
      ]
      // data: this.plannedPercentages
    };
    // console.log(this.dataSource);
  }

  fillChart() {
      /** This should be here, not in FillCHART Data  */
      this.setChartArrayToDefault();

      /** Fill Chart Data
       *      =>  FUNCTION will be 1  <=
       *      =>  2 PARAMS , [1] - Data, [2] - type eg: ( category, planned_data, ..., remaining_data ) e.t.c. <=
       *                =====>  ONLY Percentages % Handeling  <=====
       */
      this.fillChartData(this.plannedPercentages, 'category');
      this.fillChartData(this.plannedPercentages, 'planned');

      // console.log('CHART_DATA');
      // console.log(this.CHART_DATA);
  }

}

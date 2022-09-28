import { Component, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { HelperService } from './helperService/helper.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {
  title = 'amount-usage-planner';
  PLAN_WHAT = '';
  Amount = 0;

  step = 1;

  PlannedData = [];
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
      this.getScreenWidth();
  }
  ngOnChanges(changes: SimpleChanges): void {
  //   this.createAPlan();
  }
  constructor(public helperService: HelperService, public http: HttpClient) {
      this.getScreenWidth();
      this.months.push('January', 'February', 'March', 'April','May','June' ,'July','August','September','October','November','Decemeber');
      // console.log();
      this.months.forEach((value, key ) => {
        // console.log(key);
        // console.log(value);
          if(key >= (new Date()).getMonth()) {
              this.monthsFromCurrent.push(value);
          }
      });
      console.log(this.monthsFromCurrent);

      this.plannedPercentages.push(
        { 'hidden_save' : 25  },
        { 'next_year_slaughter' : 7.5 },
        { 'young_given1': 1.25 },
        { 'young_given2' : 1.25  },
        { 'emergency_cause' : 25 },
        { 'fuel' : 10 },
        { 'entertain' : 7 },
        { 'given_away' : 3 },
        { 'parent_given' : 15 },
        { 'on_my_self' : 5 }
    );

  }

  getScreenWidth() {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth);
  }
  showNextAmountInput() {
      this.step = 2;
  }

  saveAmount(data: any) {
      this.Amount = data;
      this.step = 3;
      this.createAPlan();
  }
  getPlanned() {
      return this.http.get(this.helperService.BASE_URL + 'getPlanned.php').subscribe({
          next: (response) => console.log(response),
          error: (error) => console.log(error)
      });
  }
  saveToDatabase(type = 'planned') {
      let url :any; let data: any;
      if(type == 'planned') {
          url = 'savePlanned.php';
          data  = {'amount_type': this.PLAN_WHAT,'amount': this.Amount,'plan_percentage' : this.plannedPercentages};
      }
      else if(type == 'used') {
          url = 'saveUsed.php';
          data = {'key_id': this.KEY_SELECTED, 'used_amount': this.SPENT_AMOUNT};
      }

      this.http.post(this.helperService.BASE_URL + url, data).subscribe((response: any) => {
            console.log(response);
        },
        (err :any) => {
            console.log(err);
        }
      );
  }

  createAPlan() {
      // const make_slaughter_key = 'slaughter_'+(new Date()).getFullYear();

      this.saveToDatabase('planned');

      this.createChart();

      this.AmountAgainstPercentages();

      /** Getting Total Amount Used */
      this.getUnPlannedAmount();

      this.mergePecentagesWithPlannedData();
      this.mergeMonthsWithPlannedData();

      /** Getting Unplanned Percentage */
      this.getUnPlannedPercentage();

      // console.log(this.PlannedData);
  }

  getUnPlannedAmount() {
      let totalUsedAmount = 0;
      this.dataValues.forEach((value) => {
          totalUsedAmount = totalUsedAmount + value;
      });
      this.remainAmount = this.Amount - totalUsedAmount;
  }
  getUnPlannedPercentage() {
      let totalUsedPercentage = 0;
      this.plannedPercentages.forEach((values, key) => {
          totalUsedPercentage = totalUsedPercentage + values[this.dataKeys[key]];
          this.percentagesSeparatly.push(values[this.dataKeys[key]]);
      });
      this.remainPercentage = 100 - totalUsedPercentage;
  }

  mergePecentagesWithPlannedData() {
      this.PlannedData['percentages'] = this.percentagesSeparatly;
  }
  mergeMonthsWithPlannedData() {
      this.PlannedData['months'] = this.monthsFromCurrent;
  }

  /** Spent Amount Plan  */
  saveSpentAmount() {
      (this.KEY_SELECTED == undefined)? console.log('No Item Selected.') : console.log(this.KEY_SELECTED);
      (this.SPENT_AMOUNT == undefined)? console.log('No Amount Added') : console.log(this.SPENT_AMOUNT);
      this.saveToDatabase('used');
  }

  AmountAgainstPercentages() {

    const hidden_save = Math.ceil( ((25 / 100)) * this.Amount );
    const next_year_slaughter = Math.ceil( ((7.5 / 100)) * this.Amount );
    const young_given1 = Math.ceil( ((1.25 / 100)) * this.Amount );
    const young_given2 = Math.ceil( ((1.25 / 100)) * this.Amount );
    const emergency_cause = Math.ceil( ((25 / 100)) * this.Amount );
    const fuel = Math.ceil( ((10 / 100)) * this.Amount );
    const entertain = Math.ceil( ((7 / 100)) * this.Amount );
    const given_away = Math.ceil( ((3 / 100)) * this.Amount );
    const parent_given = Math.ceil( ((15 / 100)) * this.Amount );
    const on_my_self = Math.ceil( ((5 / 100)) * this.Amount );

    this.PlannedData['causes'] = {'hidden_save':hidden_save};
    this.PlannedData['causes']['next_year_slaughter'] = next_year_slaughter;
    this.PlannedData['causes']['young_given1'] = young_given1;
    this.PlannedData['causes']['young_given2'] = young_given2;
    this.PlannedData['causes']['emergency_cause'] = emergency_cause;
    this.PlannedData['causes']['fuel'] = fuel;
    this.PlannedData['causes']['entertain'] = entertain;
    this.PlannedData['causes']['given_away'] = given_away;
    this.PlannedData['causes']['parent_given'] = parent_given;
    this.PlannedData['causes']['on_my_self'] = on_my_self;

    // console.log(this.PlannedData);
    this.dataKeys = Object.keys(this.PlannedData['causes']);
    this.dataValues = Object.values(this.PlannedData['causes']);
    // console.log(this.dataValues);
  }

  addUsedAmount() {
      this.step = 4;

      this.http.get(this.helperService.BASE_URL + 'getters.php?type=amount').subscribe({
          next: (response) => {
            console.log(response['AmountPlanner'].Planned[0].value);
            this.Amount = response['AmountPlanner'].Planned[0].value;
          },
          error: (error) => console.log(error)
      });

      this.AmountAgainstPercentages();
  }

  createChart() {
     /** Hard-coated Chart  */
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
          "category": [
            { 'label' : 'hidden_save'},
            { 'label' : 'next_year_slaughter'},
            { 'label' : 'young_given1'},
            { 'label' : 'young_given2'},
            { 'label' : 'emergency_cause'},
            { 'label' : 'fuel'},
            { 'label' : 'entertain'},
            { 'label' : 'given_away'},
            { 'label' : 'parent_given'},
            { 'label' : 'on_my_self' }
          ]
        }
      ],
      "dataset": [
        {
          "seriesName": "Planned Amount",
          "data": [
            { 'value' : 25 },
            { 'value' : 7.5 },
            { 'value': 1.25 },
            { 'value' : 1.25 },
            { 'value' : 25 },
            { 'value' : 10 },
            { 'value' : 7 },
            { 'value' : 3 },
            { 'value' : 15 },
            { 'value' : 5 }
          ]
        },
        {
          "seriesName": "Amount Used",
          "renderAs": "line",
          "data": [  /** This Amount We will Get after Developing the MODULE-2 */
            { 'value' : 25 },
            { 'value' : 7.5 },
            { 'value': 1.25 },
            { 'value' : 1.25 },
            { 'value' : 25 },
            { 'value' : 12 },
            { 'value' : 10 },
            { 'value' : 2 },
            { 'value' : 0 },
            { 'value' : 3 }
          ]
        },
        {
          "seriesName": "Remaining Amount",
          "renderAs": "area",
          "showAnchors" : "0",
          "data": [
            { 'value' : 0 },
            { 'value' : 0 },
            { 'value': 0 },
            { 'value' : 0 },
            { 'value' : 0 },
            { 'value' : -2 },
            { 'value' : -3 },
            { 'value' : 1 },
            { 'value' : 15 },
            { 'value' : 2 }
          ]
        }
      ]
      // data: this.plannedPercentages
    };
  }
}

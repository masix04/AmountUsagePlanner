import { Component, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { HelperService } from './helperService/helper.service';
import { HttpClient } from '@angular/common/http';

import plannedPercent from './RestAPI/planned-items.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {
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

  plannedPercentages = plannedPercent;
  percentagesSeparatly = [];

  remainAmount: any;
  remainPercentage: any;

  innerWidth: any;

  dataSource: any;

  KEY_SELECTED: any;
  SPENT_AMOUNT: any;

  visualizeChart = false;
  visualizeTable = false;

  usedData: any;
  used_remain_percentages: any;
  used_remain_amounts: any;

  used_remain_percentages_DESKTOP: any;
  used_remain_amounts_DESKTOP: any;

  percent_display_selected = true; /** By-default Percentage SWITCH Icon Will be Shown, While Data in Amounts Shows */
  amount_display_selected = false;

  CHART_DATA: any;

  Table_shown = false; /** To show Month Selection OR Not */

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

        /** Showing 2 month => 1 before current Month */
          if(key <= (new Date()).getMonth() && key > (new Date()).getMonth()-2) {
              this.monthsFromCurrent.push(value);
          }
      });
      console.log(this.monthsFromCurrent);

    //   this.plannedPercentages.push(
    //     { 'hidden_save' : 25  },
    //     { 'next_year_slaughter' : 7.5 },
    //     { 'young_given1': 1.25 },
    //     { 'young_given2' : 1.25  },
    //     { 'emergency_cause' : 25 },
    //     { 'fuel' : 10 },
    //     { 'entertain' : 7 },
    //     { 'given_away' : 3 },
    //     { 'parent_given' : 15 },
    //     { 'on_my_self' : 5 }
    // );
    // console.log(this.plannedPercentages);
    this.setMostVariablesToDefault();
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


  /** When Navigation to Satrt -> It will Reinitialize required Variables For this Stage */
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
      this.setUsedArraysToDefault();
      this.setChartArrayToDefault();
  }

  /** Used Array set to Initial */
  setUsedArraysToDefault() {
      this.used_remain_amounts = {
          'amounts' : [],
      };
      this.used_remain_percentages = {
          'percentages' : [],
      };

      /** Desktop */
      let currentMonth = (this._DATE).toLocaleString('default', {month: 'long'});
      let previousMonth = (new Date(Date.now() + (-30)*24*60*60*1000)).toLocaleString('default', {month: 'long'});
      // console.log(previousMonth + ' - ' + currentMonth);

      this.used_remain_amounts_DESKTOP = {
          'amounts' : {
              [previousMonth] : [],
              [currentMonth] : [],
          },
      };
      this.used_remain_percentages_DESKTOP = {
          'percentages' : {
              [previousMonth] : [],
              [currentMonth] : [],
          },
      };

    // console.log('new');
    // console.log(this.used_remain_percentages_DESKTOP);
    // console.log(this.used_remain_amounts_DESKTOP);
  }

  setChartArrayToDefault() {
      this.CHART_DATA = {
          "category" : [],
          "planned_data": [],
          "used_data": [],
          "remaining_data": []
      }
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

      this.fillChart();
      this.createAPlan('new');
  }

    /**   -------BELOW HTTP Requests------- */
  getPlanned() {
      return this.http.get(this.helperService.BASE_URL + 'getPlanned.php').subscribe({
          next: (response) => console.log(response),
          error: (error) => console.log(error)
      });
  }
  getUsed() {
      return this.http.get(this.helperService.BASE_URL + 'getUsed.php').subscribe({
          next: (response) => {
            this.usedData = response['AmountPlanner'].Used.data;
            // console.log('Direct From API: ');
            // console.log(this.usedData);
            this.separateUsedAmountAndPercentage();
          },
          error: (error) => console.log(error)
      });
  }
  addUsedAmount() {
      this.step = 4;

      this.http.get(this.helperService.BASE_URL + 'getters.php?type=amount&month='+( (this._MONTH)? this._MONTH : (this._DATE).toLocaleString('default', { month: 'long'}) )+'&year='+(this._DATE).getFullYear()).subscribe({
          next: (response) => {
            // console.log(response['AmountPlanner'].Planned[0].value);
            this.Amount = response['AmountPlanner'].Planned[0].value;
          },
          error: (error) => console.log(error)
      });

      this.AmountAgainstPercentages();
  }
  saveToDatabase(type = 'planned') {
      let url :any; let data: any;
      if(type == 'planned') {
          url = 'savePlanned.php';
          data  = {
                      'amount_type': this.PLAN_WHAT,
                      'amount': this.Amount,
                      'plan_percentage' : this.plannedPercentages};
      }
      else if(type == 'used') {
          url = 'saveUsed.php';
          data = {
                    'key_id': this.KEY_SELECTED,
                    'used_amount': this.SPENT_AMOUNT,
                    'UpdateData_month': this._MONTH || (this._DATE).toLocaleString('default', { month: 'long'}) , /** If _MONTH not selected then Curent _DATE's Month Send */
                    'UpdateData_year': this._DATE.getFullYear()
                };
      }

      this.http.post(this.helperService.BASE_URL + url, data).subscribe((response: any) => {
            console.log(response);
        },
        (err :any) => {
            console.log(err);
        }
      );
  }
    /**   ----- ABOVE HTTP Requests ------- */

  createAPlan(amountType = 'new') {
      // const make_slaughter_key = 'slaughter_'+(new Date()).getFullYear();

      /** Getting Unplanned Percentage */
      this.getUnPlannedPercentage();

      /** Only save When User enters the amount => as a new Amount, Like 1st Time Or when Ever Choose to Add amount */
      if(amountType == 'new') {
          this.saveToDatabase('planned');
      }

      /** This function starts for NEW =>
       *                                   WHICH Means -> User has not saved any item USED Amount YET
       *            -> So, no used and Remaining Chart will show
       */
      this.createChart('new');

      /** Getting Total Amount Used */ /** DONOT  NEED NOW -> Because Process Was Wrong so the RESULT also */
      // this.getUnPlannedAmount();



      /** Getting caused  */
      this.AmountAgainstPercentages();

      this.mergePecentagesWithPlannedData();
      this.mergeMonthsWithPlannedData();

      // console.log(this.PlannedData);
  }

/*  getUnPlannedAmount() {
      let totalUsedAmount = 0;
    //  console.log(this.dataValues);
      this.dataValues.forEach((value) => {
          totalUsedAmount = totalUsedAmount + value;
      });
      this.remainAmount = this.Amount - totalUsedAmount;
  }
*/
  getUnPlannedPercentage() {
      let totalUsedPercentage = 0;
      this.percentagesSeparatly = []; /** Initialized to Empty */
     // console.log(this.plannedPercentages);
      this.plannedPercentages.forEach((values, key) => {
          totalUsedPercentage = totalUsedPercentage + values[this.dataKeys[key]];
          this.percentagesSeparatly.push(values[this.dataKeys[key]]);
      });
    //  console.log(this.percentagesSeparatly);
      this.remainPercentage = 100 - totalUsedPercentage;
      this.remainAmount = ( (this.remainPercentage / 100) * this.Amount);
     // console.log('remainAmount: '+this.remainAmount);
     // console.log('remainPercentage: ' + this.remainPercentage);
  }

  mergePecentagesWithPlannedData() {
      this.PlannedData['percentages'] = this.percentagesSeparatly;
  }
  mergeMonthsWithPlannedData() {
      this.PlannedData['months'] = this.monthsFromCurrent;
  }

  /** Spent Amount Plan  */ /** VALIDATED => IF not selected THEN no SAVE */
  saveSpentAmount() {
      // (this.KEY_SELECTED == undefined)? console.log('No Item Selected.') : console.log(this.KEY_SELECTED);
      // (this.SPENT_AMOUNT == undefined)? console.log('No Amount Added') : console.log(this.SPENT_AMOUNT);
          // console.log((this._DATE).toLocaleString('default', { month: 'long'}));

      // console.log(this._DATE);
      /** DATE -Month will also be used - So will be access Directly during Store */
      (this.KEY_SELECTED == undefined || this.SPENT_AMOUNT == undefined)? 'Please fill the requirement.' : this.saveToDatabase('used');
  }

  AmountAgainstPercentages() {

    this.plannedPercentages.forEach((value:any) => {
      this.PlannedData['causes'][<any>Object.keys(value)] = Math.ceil( (( <any>(Object.values(value)) / 100)) * this.Amount );
        // console.log(key + ' - => ' + Object.keys(value) + ' -- ==> ' + Object.values(value));
    });
    // console.log(this.PlannedData['causes']);
/**
     const hidden_save = Math.ceil( ((25 / 100)) * this.Amount );
    const next_year_slaughter = Math.ceil( ((8 / 100)) * this.Amount );
    const young_given1 = Math.ceil( ((1 / 100)) * this.Amount );
    const young_given2 = Math.ceil( ((1 / 100)) * this.Amount );
    const emergency_cause = Math.ceil( ((25 / 100)) * this.Amount );
    const fuel = Math.ceil( ((10 / 100)) * this.Amount );
    const entertain = Math.ceil( ((7 / 100)) * this.Amount );
    const given_away = Math.ceil( ((3 / 100)) * this.Amount );
    const parent_given = Math.ceil( ((9 / 100)) * this.Amount );
    const on_my_self = Math.ceil( ((6 / 100)) * this.Amount );
    const home_related = Math.ceil( ((5 / 100)) * this.Amount );

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
    this.PlannedData['causes']['home_related'] = home_related;
*/
    this.extractKeysAndValues(this.PlannedData['causes'], 'planned');
  }

  /** Get Data Values and Keys */
  extractKeysAndValues(data: any, amount_type='planned') {
    this.dataValues = [];
    // console.log(this.PlannedData);
    // console.log(this.dataKeys);
    if(amount_type == 'planned') {
      this.dataKeys = Object.keys(data);
      // console.log(this.dataKeys);
    }
    this.dataValues = Object.values(data);
    // console.log(this.dataValues);
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

/** Toggle Chart Switches */
  displayChart() {
      this.visualizeChart = true;
      this.createChart('used');
  }
  hideChart() {
      this.visualizeChart = false;
  }

  /** Toggle Chart Switches */
  displayTable() {
      this.visualizeTable = true;

      /** To Make MONTH OPTION Disable when Table is Shown */
      this.Table_shown = true;

      /** Make PlannedPercentage Array to fill with Data */
      /**           In Desktop, Required => Because Only Showing Planned Percentages in that Screen Size */
      this.getUnPlannedPercentage();

      /** GET USED means - get Used Data Again
       *        CASE => If user adds an item and then checks what Used PLAN has been developed So need to get from DB Again for recent Data Addition
      */
       this.getUsed();
  }
  hideTable() {
      this.visualizeTable = false;

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

  /** Move to Planned Chart */
  moveToPlannedChart() {
      this.step = 3;
      this.visualizeChart = false; /** So Chart will not show */
      this.visualizeTable = false; /** So Table Will be Hide */

      /** Fill chart according to requirement => eg: If planned then only show Planned Chart */
      this.fillChart();


      if(this.innerWidth > 574) {
          this.getUsed();
      }

      this.createAPlan('already_stored'); /** Means => Amount has already been stored, So no need to send Request Again */
  }

  /** Navigation to Start */
  startAllOver() {
      this.setMostVariablesToDefault();
  }

  createChart(type :any) {

    /** Get Used Data first  */
    /** GET USED means Here - get Used Data Again
     *        CASE => If user adds an item and then checks what Used PLAN has been developed So need to get from DB Again for recent Data Addition
    */
    if(type == 'used') {
        this.getUsed();
    }

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






  /** Separated Percentages & Amounts for New Feature To Provide User more Choices to Visualize Data */
  separateUsedAmountAndPercentage() {
/** 1st => Initialize Values to Empty Data =>
 *           Then Fill again =>  So PILE WILL not be Create
 */
      this.setUsedArraysToDefault();

      if(this.innerWidth > 575) {
        // console.log(this.usedData);
          Object.entries(this.usedData).forEach((eachMonth: any, eachMonthKey: any) => {
              // console.log(eachMonth);
              Object.values(eachMonth[1]).forEach((value: any, key: any) => {
                // console.log(value);
                // console.log(key);
                  this.used_remain_percentages_DESKTOP['percentages'][eachMonth[0]].push(
                    {
                      'id': parseInt(value.id),
                      'used' : (value.used_percentage)? value.used_percentage : '0.0',
                      'remain' : (value.remaining_percentage)? value.remaining_percentage: '0'
                    }
                  );

                  this.used_remain_amounts_DESKTOP['amounts'][eachMonth[0]].push(
                    {
                      'id': parseInt(value.id),
                      'used' : (value.used_amount)? value.used_amount: '0' ,
                      'remain' : ( (value.planned_percentage / 100) * this.Amount ) - value.used_amount
                    }
                  );
              });
          });
          // console.log('After');
          // console.log(this.used_remain_percentages_DESKTOP);
          // console.log(this.used_remain_amounts_DESKTOP);

          /** Function Name Describes It's Function */
        this.addEmptyKeysForThoseDontHaveData(this.used_remain_percentages_DESKTOP['percentages'], 'desktop');
        this.addEmptyKeysForThoseDontHaveData(this.used_remain_amounts_DESKTOP['amounts'], 'desktop');


        /** For DESKTOP , Chart will Show of Current Month  => Right Now */
        this.fillChartData(this.used_remain_percentages_DESKTOP['percentages'][this.monthsFromCurrent[1]], 'used');
        //  console.log(this.used_remain_percentages['percentages']);
        this.fillChartData(this.used_remain_percentages_DESKTOP['percentages'][this.monthsFromCurrent[1]], 'remaining');

      }
        /** FOR mobile Screens */
      else {

              /** This Collection received in Object Type */
          Object.entries(this.usedData).forEach((eachMonth: any, key: any) => {
              // console.log(key);
              // console.log('selected Month: '); console.log(this._MONTH || this._DATE.toLocaleString('default', {month: 'long'}));
              if(eachMonth[0] == ( this._MONTH || (this._DATE).toLocaleString('default', {month: 'long'}) )) {
                  // console.log(eachMonth[1]);
                  Object.values(eachMonth[1]).forEach((value: any, iKey: any) => {
                      // console.log(value);
                      this.used_remain_percentages['percentages'].push(
                        {
                          'id': parseInt(value.id),
                          'used' : (value.used_percentage)? value.used_percentage : '0.0',
                          'remain' : (value.remaining_percentage)? value.remaining_percentage: '0'
                        }
                      );

                      this.used_remain_amounts['amounts'].push(
                        {
                          'id': parseInt(value.id),
                          'used' : (value.used_amount)? value.used_amount: '0' ,
                          'remain' : ( (value.planned_percentage / 100) * this.Amount ) - value.used_amount
                        }
                      );
                  });
                  // console.log('Required for Web: ');
                  // console.log(this.used_remain_percentages);
                  // console.log(this.used_remain_amounts);
              }

          });

            /** Function Name Describes It's Function */
          this.addEmptyKeysForThoseDontHaveData(this.used_remain_percentages['percentages'],'mobile');
          this.addEmptyKeysForThoseDontHaveData(this.used_remain_amounts['amounts'],'mobile');

          this.fillChartData(this.used_remain_percentages['percentages'], 'used');
          //  console.log(this.used_remain_percentages['percentages']);
          this.fillChartData(this.used_remain_percentages['percentages'], 'remaining');
      }

      /** By-default, Display Used Amount Values */
      this.extractKeysAndValues(this.used_remain_amounts['amounts'],'used');

      /** By-default, Display Used Amount Values DESKTOP */
      this.extractKeysAndValues(this.used_remain_amounts_DESKTOP['amounts'],'used');

      // console.log(this.used_remain_amounts);
      // console.log(this.used_remain_amounts['amounts']);
  }

      /** Filling Remaining Keys with 0 Values */
    addEmptyKeysForThoseDontHaveData(data: any, screenType: any) {
        let noFound = false; let BreakException = [];

            /** Outer 1st Loop */
        (this.plannedPercentages).forEach((value:any, key: any) => {
            // console.log(key);
            // console.log(value);
            /**
             * Used Try Catch => instead of Break in ForEach
             *              IT WAS COMPULSARY TO BREAK THE ITERATION, WHEN 'FOUND'
            */
           if(screenType == 'mobile') {
              try{
                data.forEach((item: any, itemKey: any) => {
                  console.log(item);
                  console.log('key: '+key);
                  console.log('itemKey: '+itemKey);
                    console.log(item.id+ ' != '+key+1);
                    if(item.id != (key+1)) {
                        noFound = true;
                    } else {
                        noFound = false;
                        throw BreakException;
                    }
                });
              } catch (e) {
                  if (e !== BreakException) throw e;
              }
              if(noFound == true) {
                  data.push(
                    {
                      'id': (key+1),
                      'used' : '0.0',
                      'remain' : '0'
                    }
                  );
              }
              data.sort(function(a: any,b: any) { return a.id - b.id });

           } else if(screenType == 'desktop') {
                // console.log(Object.values(data['October']));
                // console.log(Object.values(data['September']));

                /** INNER 1ST LOOP */
                this.monthsFromCurrent.forEach((_month: any) => {
                        // console.log(' MOnth: '+_month);
               try {

                    Object.values(data[_month]).forEach((item: any, itemKey: any) => {
                        // console.log(item);
                        // console.log('key: '+key);
                        // console.log('itemKey: '+itemKey);
                        // console.log(value);
                        // console.log(item.id +' != ' + (key+1))
                        if(item.id != (key+1)) {
                            noFound = true;
                        } else {
                            // console.log('____FOUND  '+ item.id);
                            noFound = false;
                            throw BreakException;
                        }

                    });
                } catch (e) {
                    if (e !== BreakException) throw e;
                }

                if(noFound == true) {
                    data[_month].push(
                      {
                        'id': (key+1),
                        'used' : '0.0',
                        'remain' : '0'
                      }
                    );
                }

                /** Sorting Each Month Data */
                data[_month].sort(function(a: any,b: any) { return a.id - b.id });

              }); /** END of MONTH Loop */
           }

        }); /** End of Planned Data Items Loop */

        // console.log(data);
        return data;
        // console.log(data.sort(function(a: any,b: any) { return a.id - b.id }));
        // return data.sort(function(a: any,b: any) { return a.id - b.id });
    }

  /** Extra Functions USED in HTML */

  getAndShowMonthName(i: any, type:any) {

      /** Each time Will bring 1 month prior  */
      // console.log(new Date(Date.now() + (-30*i)*24*60*60*1000));
      var date = new Date(Date.now() + (-30*i)*24*60*60*1000);

      /** If number type received, Then show month's Index */
      if(type == 'number') {
          return (date.getMonth()+1);
      } else { /** else 'name' type received, Then show month's name */
          return date.toLocaleString('default', { month: 'long'} ) + '  '+ date.getFullYear();
      }
  }
}

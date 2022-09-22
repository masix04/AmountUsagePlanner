import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
      this.getScreenWidth();
  }

  constructor() {
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
  createAPlan() {
      // const make_slaughter_key = 'slaughter_'+(new Date()).getFullYear();
      this.plannedPercentages.push(
          { 'hidden_save' : 25  },
          { 'next_year_slaughter' : 7.5 },
          { 'young_given1': 1 },
          { 'young_given2' : 1  },
          { 'emergency_cause' : 25 },
          { 'fuel' : 10 },
          { 'entertain' : 7 },
          { 'given_away' : 3 },
          { 'parent_given' : 15 }
      );

      const hidden_save = Math.ceil( ((25 / 100)) * this.Amount );
      const next_year_slaughter = Math.ceil( ((7.5 / 100)) * this.Amount );
      const young_given1 = Math.ceil( ((1 / 100)) * this.Amount );
      const young_given2 = Math.ceil( ((1 / 100)) * this.Amount );
      const emergency_cause = Math.ceil( ((25 / 100)) * this.Amount );
      const fuel = Math.ceil( ((10 / 100)) * this.Amount );
      const entertain = Math.ceil( ((7 / 100)) * this.Amount );
      const given_away = Math.ceil( ((3 / 100)) * this.Amount );
      const parent_given = Math.ceil( ((15 / 100)) * this.Amount );

      this.PlannedData['causes'] = {'hidden_save':hidden_save};
      this.PlannedData['causes']['next_year_slaughter'] = next_year_slaughter;
      this.PlannedData['causes']['young_given1'] = young_given1;
      this.PlannedData['causes']['young_given2'] = young_given2;
      this.PlannedData['causes']['emergency_cause'] = emergency_cause;
      this.PlannedData['causes']['fuel'] = fuel;
      this.PlannedData['causes']['entertain'] = entertain;
      this.PlannedData['causes']['given_away'] = given_away;
      this.PlannedData['causes']['parent_given'] = parent_given;

      // console.log(this.PlannedData);
      this.dataKeys = Object.keys(this.PlannedData['causes']);
      this.dataValues = Object.values(this.PlannedData['causes']);
      // console.log(this.dataValues);

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

}

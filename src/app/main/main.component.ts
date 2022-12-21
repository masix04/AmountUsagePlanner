import { Component, OnChanges, OnInit, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { HelperService } from '../helperService/helper.service';
import { HttpClient } from '@angular/common/http';
import { empty, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', './../app.component.css']
})

export class MainComponent implements OnChanges {

  title = 'amount-usage-planner';
  PLAN_WHAT = '';
  Amount = 0;

  _DATE = new Date();
  _MONTH: any;
  _YEAR: any;

  step = 1;

  PlannedData: any;
  dataKeys = [];
  dataValues = [];

  months = [];
  years = [];
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

  usedData: any;
  used_remain_percentages: any;
  used_remain_amounts: any;

  used_remain_percentages_DESKTOP: any;
  used_remain_amounts_DESKTOP: any;

  percent_display_selected = true; /** By-default Percentage SWITCH Icon Will be Shown, While Data in Amounts Shows */
  amount_display_selected = false;

  CHART_DATA: any;

  Table_shown = false; /** To show Month Selection OR Not */

  isDataStored: any;

  @ViewChild('NoDataNotification') _no_data_notify: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
      this.getScreenWidth();
  }
  ngOnChanges(changes: SimpleChanges): void {
  //   this.createAPlan();
  }
  constructor(public helperService: HelperService, public http: HttpClient, public router: Router) {
      this.getScreenWidth();
      this.isDataStored = false; /** For 1st Time NOTIFY MESSAGE to HIDE */

      this.months.push('January', 'February', 'March', 'April','May','June' ,'July','August','September','October','November','Decemeber');

      let i=-1;
      while(i<2) {
          this.years.push((this._DATE.getFullYear())+i);
          i++;
      };
  }

  getScreenWidth() {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth);
  }

    /**   -------BELOW HTTP Requests------- */
  saveBasicAmountInfo()
  {
    if(this.PLAN_WHAT == '' || this.Amount == 0 || this._MONTH == null || this._YEAR == null) {
        this.isDataStored = false; /** For 1st Time NOTIFY MESSAGE to HIDE */
        this._no_data_notify.nativeElement.style.display = 'flex'; /** Display NOTIFY Message */
    } else {
        let url :any; let data: any;
        url = 'saveBasicAmount.php';
        data = {
                  'amount_type': this.PLAN_WHAT,
                  'amount': this.Amount,
                  'month': this._MONTH,
                  'year': this._YEAR
              };

        this.isDataStored = true; /** For 1st Time NOTIFY MESSAGE to HIDE */
        this.http.post(this.helperService.BASE_URL + url, data).subscribe((response: any) => {
            console.log(response);
        });
        this.router.navigate(['/plan/create-plan']);
    }
  }
  /**   ----- ABOVE HTTP Requests ------- */

  /** Extra Functions USED in HTML */
  getAndShowMonthName(i: any, type:any) {

      /** Each time Will bring 1 month prior  */
      // console.log(new Date(Date.now() + (-30*i)*24*60*60*1000));
      var date = new Date(Date.now() + (-30*i)*24*60*60*1000);

      /** If number type received, Then show month's Index */
      if(type == 'number') {
          return (date.getMonth()+1);
      } else { /** else 'name' type received, Then show month's name */
          return date.toLocaleString('default', { month: 'long'} );
      }
  }

  hideMessage() {
    this._no_data_notify.nativeElement.style.display = 'none';
  }

}

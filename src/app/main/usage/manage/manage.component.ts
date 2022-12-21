import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../../helperService/helper.service';
import { SharedService } from '../../../helperService/shared.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css', './../../../app.component.css']
})
export class ManageComponent implements OnInit {

    plannedKeys: any;
    KEY_SELECTED: any;
    USED_PERCENTAGE: any;
    _MONTH: any;
    _YEAR: any;
    months: any;
    years: any;

    @ViewChild('month') _month_selection: any;
    @ViewChild('year') _year_selection: any;
    @ViewChild('key') _key_selection: any;
    @ViewChild('percentage') _percentage: any;

    constructor(public router: Router, public sharedService: SharedService, public helperService: HelperService) {
      // this.getPlanned();
      this.months = [];
      this.years = [];
      this.plannedKeys = this.sharedService.getPlannedKeys();
      this.formatingKeysGotFromSharedService();
      this.getAmountMonthsAndYear();
    }

    formatingKeysGotFromSharedService()
    {
      this.plannedKeys = this.plannedKeys.split(',');
    }

    resetToDefaults()
    {
      // console.log('BEFORE: ');
      // console.log(this._month_selection.nativeElement.value);
        this._month_selection.nativeElement.value = null;
        this._year_selection.nativeElement.value = null;
        this._key_selection.nativeElement.value = null;
        this._percentage.nativeElement.value = null;
        // console.log('AFTER: ');
        // console.log(this._month_selection.nativeElement.value);
    }

    ngOnInit() {}

    getAmountMonthsAndYear()
    {
        this.helperService.getSaveAmountsMonthAndYear().subscribe( {
            next: (response) => {
                                  // console.log(response);
                                  // response['Amount'].data;
                                  this.getMonthsSeparatly(response['Amount'].data);
                                },
            error: (error) => console.log(error),
        });
    }

    getMonthsSeparatly(months: any)
    {
        months.forEach((value: any, key: any) => {
            this.months[key] = value['month'];
            this.years[key] = value['year'];
        });
        this.years = this.years.filter((test: any, index: any, array: any) => index === array.indexOf(test)); /** Remove Duplicates */
        this.sharedService.saveMonths(this.months);
        this.sharedService.saveYears(this.years);
    }

    saveUsage() {
//      console.log(this.KEY_SELECTED);
//      console.log(this.USED_PERCENTAGE);
      let data = {
          'key_id': this.KEY_SELECTED,
          'used_percentage' : this.USED_PERCENTAGE,
          'UpdateData_month': this._MONTH,
          'UpdateData_year': this._YEAR,
      };
      this.resetToDefaults();
      this.httpSaveUsage(data);
    }

    httpSaveUsage(data: any) {
      this.helperService.saveUsage(data).subscribe( {
          next: (response) =>
          {
            console.log(response);
          },
          error: (error) => console.log(error)
      });
    }

    viewUsage() {
        this.router.navigate(['usage/display-spent']);
    }

}

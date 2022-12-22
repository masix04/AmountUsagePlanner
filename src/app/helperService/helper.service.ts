import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor( public http: HttpClient , public meta: Meta, public title: Title) { }
    BASE_URL = "http://localhost/__practice_Angular_CONCEPTS/AmountUsagePlanner/amount-usage-planner-improved/amount-usage-planner-php/controllers/";

    getPlanned() {
      let url = this.BASE_URL + 'getPlanned.php';
      return this.http.get(url);
    }

    saveUsage(data: any) {
      let url = this.BASE_URL + 'saveUsed.php';
      console.log(url);
      return this.http.post(url, data);
    }

    getSaveAmountsMonthAndYear() {
      let url = this.BASE_URL + 'getAmount.php';
      return this.http.get(url);
    }

    getUsage(data: any) {
      let url = this.BASE_URL + 'getUsed.php';
      return this.http.post(url, data);
    }

    editPlanData(data: any) {
      let url = this.BASE_URL + 'editPlan.php';
      return this.http.post(url, data);
    }
}

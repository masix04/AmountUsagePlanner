import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor( public http: HttpClient , public meta: Meta, public title: Title) { }

    saveCreatedPlan(data: any) {
        let BASE_URL = "http://localhost/__practice_Angular_CONCEPTS/AmountUsagePlanner/amount-usage-planner-php/controllers/ApiController.php/";
        return this.http.post( BASE_URL + 'save-plan-values', data);
    }
}

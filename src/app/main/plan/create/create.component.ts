import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/helperService/helper.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css', './../../../app.component.css']
})
export class CreateComponent implements OnInit {

    // plannedPercentages: any;
    PLAN_ITEM: any;
    PLAN_PERCENTAGE: any;

    constructor(public router: Router, public http: HttpClient, public helperService: HelperService) {
        // this.plannedPercentages = [];
    }

    ngOnInit() {
    }

    savePlan() {
        // this.plannedPercentages.push(
        //     { 'key_name': this.PLAN_ITEM },
        //     { 'planned_percentage' : this.PLAN_PERCENTAGE },
        // );
        let data = {
            'key_name': this.PLAN_ITEM,
            'planned_percentage' : this.PLAN_PERCENTAGE
        };
        this.httpSavePlan(data);
    }

    httpSavePlan(data: any) {
        return this.http.post(this.helperService.BASE_URL + 'savePlan.php', data).subscribe( {
            next: (response) => console.log(response),
            error: (error) => console.log(error)
        });
    }

    viewPlan() {
        this.router.navigate(['plan/display-plan']);
    }
}

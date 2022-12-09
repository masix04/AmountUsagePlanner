import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css', './../../../app.component.css']
})
export class UsageDisplayComponent implements OnInit {

  CHART_DATA: any;
  constructor() { }

  ngOnInit() {
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
}

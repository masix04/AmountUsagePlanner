import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private plannedKeys = new BehaviorSubject<string>(null);
  private plannedPercentages = new BehaviorSubject<any>(null);
  private monthsData = new BehaviorSubject<any>(null);
  private yearsData = new BehaviorSubject<any>(null);

  constructor() { }

  storePlannedKeys(keys: any) {
      this.plannedKeys.next(keys);
//      console.log(keys);
      console.log(this.plannedKeys.value);
      localStorage.setItem('plannedKeys', this.plannedKeys.value);
  }
  storePlannedPercentages(percentages: any) {
      this.plannedPercentages.next(percentages);
//      console.log(percentages);
      console.log(this.plannedPercentages.value);
      localStorage.setItem('plannedpercentages', this.plannedPercentages.value);
  }
  saveMonths(months: any)
  {
      this.monthsData.next(months);
      localStorage.setItem('saveMonths', this.monthsData.value);
  }
  saveYears(years: any)
  {
      this.yearsData.next(years);
      localStorage.setItem('saveYears', this.yearsData.value);
  }

  getPlannedKeys() {
    /** If Update happens in Plan => Remove Previous One and Add newOne */
    return localStorage.getItem('plannedKeys') || this.plannedKeys;
  }
  getPlannedPercentages() {
    return localStorage.getItem('plannedPercentages') || this.plannedPercentages;
  }
  getSavedMonths() {
    return localStorage.getItem('saveMonths') || this.monthsData;
  }
  getSavedYears() {
    return localStorage.getItem('saveYears') || this.yearsData;
  }
}

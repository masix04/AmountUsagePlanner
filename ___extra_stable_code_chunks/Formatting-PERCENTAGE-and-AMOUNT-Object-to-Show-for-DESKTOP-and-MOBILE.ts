




/**
*  For MOBILE and DESKTOP
        => Both using 2 different Object Structure
        => Work is Lengthy
        => BUT Stable For BOTH
        => HTML TEMPLATE will also need to change for Both.
        => Right Now HTML TEMPLATE is not Developed.
        => BUT, Code to get Their and Show YOU an outome of How OBJECT will Look Like With Data is DONE.
*/



import plannedPercent from './RestAPI/planned-items.json';


export class AppComponent implements OnChanges {

    usedData: any;
    used_remain_percentages: any;
    used_remain_amounts: any;

    used_remain_percentages_DESKTOP: any;
    used_remain_amounts_DESKTOP: any;

    _DATE = new Date();
    _MONTH: any;

    innerWidth: any;

    Amount: any;

    plannedPercentages = plannedPercent;

    months: any;
    monthsFromCurrent: any;



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
      this.setMostVariablesToDefault();
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



/** IN .ts file */

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
              console.log('After');
              console.log(this.used_remain_percentages_DESKTOP);
              console.log(this.used_remain_amounts_DESKTOP);

              /** Function Name Describes It's Function */
            this.addEmptyKeysForThoseDontHaveData(this.used_remain_percentages_DESKTOP['percentages']);
            this.addEmptyKeysForThoseDontHaveData(this.used_remain_amounts_DESKTOP['amounts']);

          } else {

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
                      console.log('Required for Web: ');
                      console.log(this.used_remain_percentages);
                      console.log(this.used_remain_amounts);
                  }

              });
          }

          /** Function Name Describes It's Function */
          this.addEmptyKeysForThoseDontHaveData(this.used_remain_percentages['percentages']);
          this.addEmptyKeysForThoseDontHaveData(this.used_remain_amounts['amounts']);

          this.fillChartData(this.used_remain_percentages['percentages'], 'used');
        //  console.log(this.used_remain_percentages['percentages']);
          this.fillChartData(this.used_remain_percentages['percentages'], 'remaining');

          /** By-default, Display Used Amount Values */
          this.extractKeysAndValues(this.used_remain_amounts['amounts'],'used');
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
           } else {
                console.log(Object.values(data['October']));
                console.log(Object.values(data['September']));

                /** INNER 1ST LOOP */
                this.monthsFromCurrent.forEach((_month: any) => {
                        console.log(' MOnth: '+_month);
               try {

                    Object.values(data[_month]).forEach((item: any, itemKey: any) => {
                        console.log(item);
                        // console.log('key: '+key);
                        // console.log('itemKey: '+itemKey);
                        // console.log(value);
                        console.log(item.id +' != ' + (key+1))
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

        console.log(data);
        // console.log(data.sort(function(a: any,b: any) { return a.id - b.id }));
        // return data.sort(function(a: any,b: any) { return a.id - b.id });
    }
}

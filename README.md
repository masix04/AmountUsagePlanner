# AmountUsagePlanner

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Branches 
  1- **master**
      *Completed requirements*
  2- **master_v2**
      *Optimizing & improving by using more better methods*

## Explain Project 

 Used Angular's Single Component to Develop all of this.
 Used Core PHP for Backend Request Accept and Respond, Connection to MySQL Database
 Used ## fusioncharts to display Analysis Chart
  
## Requirements fulfilled

  ## Remember => 
      In THIS SPA, We need to call created functions whenever any required Process Started. So, We cannot just work in Contructor.

 [29/September/2022]
 1- Remove not required HTTP Requests on user navigation to pages.
 2- Provide Multiple Visualizations of Usage Amount [Tabular-Form]  & [Charts].
    a- In Tabular Form, Usage have a choice to get 'remaining' [percentage] OR [Amount]. with above Icon 
        If Icon shows [%], it means Data is showing in Amount And By Click You can View Percentages.
        If Icon shows [Rs], it means Vice Versa of Above Point.
 3- Improve [Header] and [Footer] in both Design and Text to display.
 4- Provide User an Ease to Navigate with possible Situations
      i- From (Adding a used Amount for a plan's Item) towards ( the Table of Already Planned Items Amount). 

  [3rd/October/2022]
  1- Made Chart Dynamic 
  2- Improvements in getting used Data when required
  3- Initialize Data Arrays before push Data in it.
  4- Conditionaly added 0 if their is not Spent amount for an item. 
  5- Backend-Fixed: mySQL Query to get Used & Remaining Amount and percentages  
  6- Improved in a sense to make Planned Data Dynamic -> Helpfull in CASE - If new item will be add then only one place where need 
  7- If Data which has [sent in request] and [saved in Database] are not same length then DELETE old and Add a new One.

  [4th/October/2022] 
  1- Fixing Function Calls Because this is Single Page Application. And it's Constructor call only 1 time
     a- [Planned] and [Used] Charts will show on request and fullfil the request.
  2- **Create an architecture to show how Functions are working**

  [5th/October/2022]
  1- Add a Button to *[save Updated Planned items Or Percentage to DB]* Before move to add Used Amount PROCESS.

  [6th/October/2022]
  1- CheckedOut new branch *master_v2* where new Optimized ways will implement.

  ## UPDATE Process
 
  ## -- Idea came to mind  [for '*master_v2*']

  1- Instead of Starting the Planned PERCENTAGE process from [.JSON] File and the update here and apply changes to Database. Do it other Way. Which is -> Provide a feature to **Create Planned Items with Percentages**  when created it **->** save to Database **=>** move to Home page **=>** Show button to **Update the Created Plan** If came from Created Plan process. Otherwise the above mentioned [create-new].   **==>** then Start process which is already working. 

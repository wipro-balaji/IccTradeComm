import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
// import { QuestionaireScoreServices } from './questionaire-score-services';
import { DatePipe } from '@angular/common';
// import { FUNDINGREQUESTCONSTANTS } from '../../shared/constants/constants';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { StaicDataMaintenance } from '../../shared/constants/constants'
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { FUNDINGREQUESTCONSTANTS } from '../../shared/constants/constants';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-finanance-limit-maintanance',
  templateUrl: './finanance-limit-maintanance.component.html',
  styleUrls: ['./finanance-limit-maintanance.component.scss']
})
export class FinananceLimitMaintananceComponent implements OnInit {
  limitMaintanceForm: FormGroup;
  countrylimitMaintanceForm: FormGroup;
  mainlimitMaintanceForm: FormGroup;
  displayedColumns: string[] = ['Exposure', 'Modified', 'Available Exposure', 'Created'];
  dataSource: any;
  groupTooltip = StaicDataMaintenance;
  isEdit: boolean;
  isOk: boolean;
  groupId: any;
  enableReadonly = true
  invoiceForm: FormGroup;
  dataSourceTwo = new MatTableDataSource(); //data
  displayedColumnsTwo: string[] = [
    'sme',
    'country',
    'utilizedAmt',
    'balAmt'
  ];
  dataSourceThree = new MatTableDataSource(); //data
  displayedColumnsThree: string[] = [
    'country',
    'utzAmt',
    'avlAmt'
  ];
  fundingTooltip = FUNDINGREQUESTCONSTANTS;
  overAllLimit;
  smeoverAllLimit;
  countryoverLimitval;
  countrysmeoverAllLimitVal;
  totalExposure:number=0;
  countrytotalExposure:number=0;
  isOpen = '';

  // Charts
  lineChartData = [{
    label: '# of Votes',
    data: [10, 19, 3, 5, 2, 3],
    borderWidth: 1,
    fill: false
  }];

  lineChartLabels = ['2013', '2014', '2014', '2015', '2016', '2017'];

  lineChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  lineChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)'
    }
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  areaChartData = [{
    label: '# of Votes',
    data: [10, 19, 3, 5, 2, 3],
    borderWidth: 1,
    fill: true
  }];

  areaChartLabels = ['2013', '2014', '2014', '2015', '2016', '2017'];

  areaChartOptions = {};

  areaChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)',
      backgroundColor: 'rgba(255,99,132,.2)'
    }
  ];


  doughnutPieChartData = [
    {
      data: [30, 40, 30],
    }
  ];

  doughnutPieChartLabels = ['Pink', 'Blue', 'Yellow'];

  doughnutPieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  doughnutPieChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
  ];


  scatterChartData = [
    {
      label: 'First Dataset',
      data: [{
          x: -10,
          y: 0
        },
        {
          x: 0,
          y: 3
        },
        {
          x: -25,
          y: 5
        },
        {
          x: 40,
          y: 5
        }
      ],
      borderWidth: 1
    },
    {
      label: 'Second Dataset',
      data: [{
          x: 10,
          y: 5
        },
        {
          x: 20,
          y: -30
        },
        {
          x: -25,
          y: 15
        },
        {
          x: -10,
          y: 5
        }
      ],
      borderWidth: 1
    }
  ];

  scatterChartOptions = {
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  };

  scatterChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)'      ]
    },
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ]
    }
  ];

  mobileScreen = false;
  end = false;
  start = true;
  currentPage = 0;
  pageCount = 1;
  limit = 7;
//multiple line chart
chartType = "bar";
chartOptions = {
responsive: true,
heigh:400,
width :700
};
chartData = [
// { data: [350, 600, 260, 700, 650, 416, 400, 300, 556, 500, 600, 580], label: "Funding Requested" },
{ data: [0,0,0,0,0,0,0,0,0,0,0,0,0], label: "Actual Funding" },
// { data: [120, 200, 700], label: "Repayment" },
];
chartLabels = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
chartColors = [
{
backgroundColor: "rgba(204, 51, 0, .3)",
borderColor: "rgba(204, 51, 0, .7)",
},
{
backgroundColor: "rgba(0, 137, 132, .3)",
borderColor: "rgba(0, 10, 130, .7)",
},
{
backgroundColor: "rgba(0, 128, 43, .3)",
borderColor: "rgba(0, 128, 43, .7)",
}
];
  //Charts
  constructor(public router: Router,
    private fb: FormBuilder, private apiService: ApiService, private datePipe: DatePipe, private toastr: ToastrService) {
    this.mainlimitMaintanceFormBuild()
    this.groupsFormBuild()
    this.countrylimitMaintanceFormBuild();
   
  }
  ngOnInit(): void {
    this.overAllLimit = this.limitMaintanceForm.value.overAllLimit;
    this.smeoverAllLimit = this.limitMaintanceForm.value.smeoverAllLimit;
    this.countryoverLimitval = this.countrylimitMaintanceForm.value.countryoverAllLimit
    this.countrysmeoverAllLimitVal = this.countrylimitMaintanceForm.value.countrysmeoverAllLimit


    this.limitMaintance();
    this.countrylimitMaintance();
  }
  isOpenHandle(isTrue) {
    this.isOpen = isTrue === 'inActive' ? 'active' : 'inActive';
  }
  limitMaintance() {
    this.totalExposure=0;
    let limitMaintance = [{
      sme: "SME1",
      country: 'SINGAPORE',
      utilizedAmt: 20000,
    }, {
      sme: "SME2",
      country: 'SINGAPORE',
      utilizedAmt: 40000,
    }, {
      sme: "SME3",
      country: 'SINGAPORE',
      utilizedAmt: 4000,
    },
    {
      sme: "SME3",
      country: 'SINGAPORE',
      utilizedAmt: 300,
    }]
    limitMaintance.forEach(element => {
      if(element){
      this.totalExposure += element.utilizedAmt
      element['balanceAmt'] = this.smeoverAllLimit-element.utilizedAmt
      }
      });
      let totalCalculation ={
      sme: "",
      country:'Total Exposure',
      utilizedAmt: this.totalExposure,
      balanceAmt:this.overAllLimit -this.totalExposure
      }
      limitMaintance.push(totalCalculation);
    this.dataSourceTwo = new MatTableDataSource(limitMaintance);
  }
  countrylimitMaintance() {
    this.countrytotalExposure=0;
    let countrylimitMaintance = [{
      country: 'SINGAPORE',
      utzAmt: 20000,
      // balanceAmt: 48000,
    }, {
      country: 'SINGAPORE',
      utzAmt: 40000,
      // avlAmt: 48000,
    }, {
      country: 'SINGAPORE',
      utzAmt: 4000,
      // avlAmt: 48000,
    },
    {
      country: 'SINGAPORE',
      utzAmt: 300,
      // avlAmt: 48000,
    }]
    countrylimitMaintance.forEach(element => {
      if(element){
      this.countrytotalExposure += element.utzAmt
      element['avlAmt'] = this.countrysmeoverAllLimitVal-element.utzAmt
      }
      });
      let totalCalculation ={
      sme: "",
      country:'Total Exposure',
      utzAmt: this.countrytotalExposure,
      avlAmt:this.countryoverLimitval -this.countrytotalExposure
      
      }
      countrylimitMaintance.push(totalCalculation);
      this.dataSourceThree = new MatTableDataSource(countrylimitMaintance);
  }
  changesmelimit(event, type) {
    console.log(event, "event");
    if (type == 'overAllLimit') {
      this.overAllLimit = event.target.value
      this.limitMaintance()
    }
    else if (type == 'smeoverAllLimit') {
      this.smeoverAllLimit = event.target.value
      this.limitMaintance()
    }
  }
  changecountrylimit(event, type) {
    console.log(event, "event");
    if (type == 'overAllLimit') {
      this.countryoverLimitval= event.target.value
      this.countrylimitMaintance()
    }
    else if (type == 'countryoverAllLimit') {
      this.countrysmeoverAllLimitVal = event.target.value
      this.countrylimitMaintance()
    }
  }
  
  
  groupsFormBuild() {
    this.limitMaintanceForm = this.fb.group({
      overAllLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure, Validators.required],
      smeoverAllLimit: [this.mainlimitMaintanceForm.value.mainsmeexposure, Validators.required],
      ccy: ['SGD', Validators.required]
    });

  }
  countrylimitMaintanceFormBuild() {
    this.countrylimitMaintanceForm = this.fb.group({
      countryoverAllLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure, Validators.required],
      countrysmeoverAllLimit: [this.mainlimitMaintanceForm.value.maincountryexposure, Validators.required],
      countryccy: ['SGD', Validators.required]
    });
  }
  mainlimitMaintanceFormBuild() {
    this.mainlimitMaintanceForm = this.fb.group({
      mainoverallexposure: ['700000', Validators.required],
      maincountryexposure: ['400000', Validators.required],
      mainsmeexposure: ['500000', Validators.required],
      mainlimitccy: ['SGD', Validators.required],
      mainsector: ['0', Validators.required]
    });
  }
  clickedit() {
    this.enableReadonly = true;
    this.isEdit = true;
    this.isOk = true;
  }
  mainlimitMaintanceFormSubmit(){
    this.overAllLimit = this.mainlimitMaintanceForm.value.mainoverallexposure;
    this.countryoverLimitval = this.mainlimitMaintanceForm.value.mainoverallexposure;
    this.groupsFormBuild()
    this.countrylimitMaintanceFormBuild();
    this.limitMaintance();
    this.countrylimitMaintance();
    this.toastr.success("Limit Maintanance Updated Successfully")
  }
  onSubmitLimitForm() {
    this.isOk = false;
    if (this.limitMaintanceForm.value && this.limitMaintanceForm.status == "VALID") {
      var ddatae = new Date();
      let value = this.limitMaintanceForm.value;
      value.created = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
      // value.modified = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
      console.log(value, "this.limitMaintanceForm.value");
      let array = []
      array.push(value)
      this.dataSource = new MatTableDataSource(array);
    } else {
      this.isOk = true;
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  clickadd() {
    this.enableReadonly = false
    var ddatae = new Date();
    let value = this.limitMaintanceForm.value;
    value.created = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
    value.modified = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
    console.log(value, "this.limitMaintanceForm.value");
    let array = []
    array.push(value)
    this.dataSource = new MatTableDataSource(array);
    this.limitMaintanceForm.get('modifyExpoOptions').clearValidators();
    this.limitMaintanceForm.get('modifyExposureAmt').clearValidators();
    this.limitMaintanceForm.controls.modifyExpoOptions.enable();
    this.limitMaintanceForm.controls.modifyExposureAmt.enable();
    this.enableReadonly = true;
    this.isEdit = true;
  }
}
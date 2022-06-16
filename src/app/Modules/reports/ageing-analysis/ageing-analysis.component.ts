import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ageing-analysis',
  templateUrl: './ageing-analysis.component.html',
  styleUrls: ['./ageing-analysis.component.css']
})
export class AgeingAnalysisComponent implements OnInit {

  claimType:any=null;columnHeader:any;
  claimList:any[]=[];
  constructor() { 
    this.columnHeader = [
      { key: "ClaimNumber", display: "Claim Number" },
        { key: "CivilId", display: "Civil Id" },
        { key: "PolicyNumber", display: "Policy Number" },
        { key: "VehicleChassisNumber", display: "Chassis Number" },
        { key: "RecoveryCompanyName", display: "Insured Company" },
        { key: "AccidentDate", display: "Accident Date" },
        { key: "ClaimIntimatedDate", display: "Intimate Date" },

      // {
      //   key: "actions", display: "Edit",
      //   config: {
      //     isEditActions: true,
      //   },
      // },
    ];
  }

  ngOnInit(): void {
  }

}

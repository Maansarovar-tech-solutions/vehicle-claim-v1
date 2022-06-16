import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claim-received',
  templateUrl: './claim-received.component.html',
  styleUrls: ['./claim-received.component.css']
})
export class ClaimReceivedComponent implements OnInit {

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

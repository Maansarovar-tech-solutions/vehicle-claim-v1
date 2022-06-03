import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit,OnDestroy{

  private subscriptionPageTitle = new Subscription();
  public pageName:any;
  public breadcrumbList:any[]=[];
  public totalRouterList:any[]=[];

  @Input("dashboardRadio") dashboardRadio:any='';

  constructor(
    private sharedService:SharedService,

  ) {

  }

  ngOnInit(): void {
   this.subscriptionPageTitle = this.sharedService.pageTitle.subscribe((ele:any)=>{
      console.log(ele)
      this.pageName=ele;

    })
  }

  ngOnDestroy(): void {
      this.subscriptionPageTitle.unsubscribe();
  }


}

import { AppComponent } from './../../../app.component';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import * as Mydatas from '../../../../assets/app-config.json';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import { VehicleSearchComponent } from 'src/app/Modules/vehicle-search/vehicle-search.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public LoginDetails: any;
  public searchData:any;
  public config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    listBackgroundColor: `#dad6ff`,
    fontColor: `rgb(8, 54, 71)`,
    backgroundColor: `rgb(208, 241, 239)`,
    selectedListFontColor: `blue`,
    highlightOnSelect: true,
    collapseOnSelect: true,
  };

  public appitems: any = [];
  public pageName: any = '';
  userDatails: any;
  userType: any;
  public showIframe: any = false;
  searchValue: any;
  searchBy: any = '';
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public recoveryType: any = '';
  public step: any = '1'
  @ViewChild('content1') content1 : any;
  imageUrl: any;
  uploadDocList: any[]=[];
  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private addVehicleService: AddVehicleService,
    private modalService:NgbModal,
    public dialog: MatDialog,
    public app:AppComponent
  ) {
    this.LoginDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    console.log(this.LoginDetails);
    this.recoveryType = sessionStorage.getItem("claimType");

    this.router
      .events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
        return null;
      })).subscribe((customData: any) => {
        this.pageName = customData;
        console.log("PageName",this.pageName)
        this.sharedService.onGetPageTitle(this.pageName);

      });

  }

  ngOnInit(): void {
    if (this.LoginDetails) {
      console.log("Login Detailsss", this.LoginDetails);
      this.userType = this.LoginDetails.LoginResponse.UserType;
    }
    this.appitems = [
      {
        label: 'Masters',
        faIcon: 'fas fa-border-all',

        items: [
          {
            label: 'Make Master',
            link: '/Admin/MakeMaster',
            faIcon: 'fas fa-border-all'
          },
          {
            label: 'Model Master',
            link: '/Admin/ModelMaster',
            faIcon: 'fas fa-border-all'
          },
          {
            label: 'Body Type Master',
            link: '/Admin/BodyTypeMaster',
            faIcon: 'fas fa-border-all'
          },
          {
            label: 'Claim Type Master',
            link: '/Admin/ClaimTypeMaster',
            faIcon: 'fas fa-border-all'
          },
          {
            label: 'Loss Type Master',
            link: '/Admin/LossTypeMaster',
            faIcon: 'fas fa-border-all'
          },
        ]
      },
      {
        label: 'User Creation',
        faIcon: 'fas fa-user-tie',
        link: '/Admin/ExistingUserDetails',
      },

    ]

  }
  redirectMake() {
    this.resetSearchData();
    this.router.navigate(['/Home/MakeMaster']);
    this.showIframe = false;
  }
  redirectModel() {
    this.resetSearchData();
    this.router.navigate(['/Home/ModelMaster']);

    this.showIframe = false;
  }
  redirectBodyType() {
    this.resetSearchData();
    this.router.navigate(['/Home/BodyTypeMaster']);

    this.showIframe = false;
  }
  redirectColour() {
    this.resetSearchData();
    this.router.navigate(['/Home/ColorMaster']);

    this.showIframe = false;
  }
  redirectIns() {
    this.resetSearchData();
    this.router.navigate(['/Home/InsuranceMaster']);

    this.showIframe = false;
  }
  redirectHome() {
    this.resetSearchData();
    this.showIframe = false;
    this.router.navigate(['/Home']);
  }
  getApiDetails() {
    //window.open("http://192.168.1.18:8081/swagger-ui.html");
    if (!this.showIframe)
      this.showIframe = true;
    else this.showIframe = false;
  }
  getUserCreation(){
    this.showIframe = false;
    this.router.navigate(['Home/ExistingLoginDetails']);
  }
  addClaim() {
    this.router.navigate(['Home/New-Claim/Claim-Form']);
  }
  uploadExcelModal(){
    this.uploadDocList = [];
    this.modalService.open(this.content1, { size: 'xl', backdrop: 'static' });
  }
  hide() {
    this.modalService.dismissAll();
  }
  onUploadDocuments(target:any,fileType:any,type:any){
    let event:any = target.target.files;
    console.log("Event ",event);
    let fileList = event;
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader:any = new FileReader();
      reader.readAsDataURL(element);
        var filename = element.name;

        let imageUrl: any;
        reader.onload = (res: { target: { result: any; }; }) => {
          imageUrl = res.target.result;
          this.imageUrl = imageUrl;
          this.uploadDocList.push({ 'url': this.imageUrl,'DocTypeId':'','filename':element.name, 'JsonString': {} });

        }

    }
    console.log("Final File List",this.uploadDocList)
  }
  onDeleteDocument(index:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
          this.uploadDocList.splice(index,1);
      }
    })
  }
  onSampleDownload(){
    let UrlLink = `${this.ApiUrl1}getsampleexcel`;
    let ReqObj = {
      "ExcelDownloadReq": "ClaimUploadExcel"
    }
    return this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Excel Data", data);
      var a = document.createElement("a");
      a.href = data.Result.ImgUrl;
      a.download = data.Result.fileName;
      downloadBase64File(data,'SampleDocument')
    }, (err) => { })

  }
  resetSearchData() {
    this.searchBy = ''; this.searchValue = null;
    sessionStorage.removeItem("searchList");
  }
  onNavigation(val: any) {
    this.resetSearchData();
    console.log("Received Val", val)
    this.showIframe = false;
    sessionStorage.removeItem("claimEditReq");
    sessionStorage.removeItem("policyEditReq");
    if (val == 'Policy') {
      this.router.navigate(['/Home/policy']);
    }
    else if (val == 'Claims') {
      this.router.navigate(['/Home/Claim']);
    }
    else if (val == 6) {
      this.router.navigate(['/Home/receivable-AccountStatement']);
    }
    else if (val == 7) {
      this.router.navigate(['/Home/payable-AccountStatement']);
    }
    else if (val === 'Receivable') {
      sessionStorage.setItem('claimType', String(val))
      this.router.navigate(['/Home/Receivable']);
    }
    else if (val === 'Payable') {
      sessionStorage.setItem('claimType', String(val))
      this.router.navigate(['/Home/Payable']);
    }
    else if(val === 'claimSubmitted'){
      this.router.navigate(['/Home/claimSubmittedReports']);
    }
    else if(val === 'claimReceived'){
      this.router.navigate(['/Home/claimReceivedReports']);
    }
    else if(val === 'ageingAnalysis'){
      this.router.navigate(['/Home/ageingAnalysisReports']);
    }
  }


  onStartNewClaim(id: any) {
    sessionStorage.removeItem("claimEditReq");
    sessionStorage.removeItem("policyEditReq");

    if(id =='Policy'){
      this.router.navigate(['/Home/policy/new-policy'],{ queryParams: { isPolicyForm: true } });
    }else{
      sessionStorage.setItem('claimTypeId', id);
      this.router.navigate(['/Home/recovery-claim-form']);
    }
  }


  onSearchDetails() {
    var UrlLink = '';
    var ReqObj = {};
    console.log("Final Search Req",this.searchBy)
    if(this.searchBy == undefined || this.searchBy == "" || this.searchBy == null){
      this.searchBy = 'Chassis Number';
    }
    if (this.searchBy == 'Chassis Number') {
      // UrlLink = `${this.ApiUrl1}totalloss/vehicleIinfo/bychassisno`;
      // ReqObj = {
      //   "ChassisNo": this.chassisForm.controls['chassisno'].value
      // }
      UrlLink = `${this.ApiUrl1}api/search/vehicle/policies`;
      ReqObj = {
        "VehicleChassisNumber": this.searchValue
      }

    }
    if (this.searchBy == 'PolicyNo') {
      UrlLink = `${this.ApiUrl1}api/searchpolicyinfo`;
      ReqObj = {
        "PolicyNumber": this.searchValue
      }

    }

    return this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Search Data", data);
      if(data.ErrorMessage.length==0){
        this.searchData = data.Result?.VehicleDetails;
        sessionStorage.setItem("searchList", JSON.stringify(data.Result));
        this.router.navigate(['Home/Vehicle-Search'])
      }
    }, (err) => { })
  }

  isCurrentRoute(name : string) : boolean {
    return this.pageName === name;
 }


  onLogOut() {
    this.authService.logout();
    sessionStorage.clear();
    this.router.navigate(['Login']);

  }

  onMoveClaimInfo(id:any){
    console.log(this.searchData);
    sessionStorage.setItem('claimTypeId',id);
    sessionStorage.removeIem('claimEditReq')
    this.router.navigate(['/Home/policy/new-policy'],{ queryParams: {isClaimForm:true,VehicleChassisNumber:this.searchData.VehicleChassisNumber,PolicyNumber:this.searchData?.PolicyNumber} });

  }


  reloadComponent(url: string) {
    let currentUrl = url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  onUploadPolicy(){

  }

}

function downloadBase64File(base64Data: any, fileName: string) {
  console.log(base64Data)
  const linkSource = `${base64Data?.Result?.ImgUrl}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = `${fileName}`;
  downloadLink.click();
}

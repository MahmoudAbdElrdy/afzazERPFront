import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/common-services/shared-service';
import { ToolbarPath } from '../../../../shared/interfaces/toolbar-path';
import { NgxSpinnerService } from 'ngx-spinner';
import { CODE_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, NAME_REQUIRED_VALIDATORS, PHONE_VALIDATORS } from '../../../../shared/constants/input-validators';
import { map, Subscription } from 'rxjs';
import { ToolbarData } from '../../../../shared/interfaces/toolbar-data';
import { ToolbarActions } from '../../../../shared/enum/toolbar-actions';
import { navigateUrl } from '../../../../shared/helper/helper-url';
import {UserServiceProxy} from '../../services/user-service'
import { RoleServiceProxy } from '../../services/role.servies';
import { RoleDto } from '../../models/role';
import { UserDto } from '../../models/User';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  //#region Main Declarations
  userForm!: FormGroup;
  sub: any;
  url: any;
  id: any = 0;
  currnetUrl;
  public show: boolean = false;
  lang=localStorage.getItem("language")
  user:UserDto[] = [];
  addUrl: string = '/security/user/add-user';
  updateUrl: string = '/security/user/update-user/';
  listUrl: string = '/security/user';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:this.translate.instant("component-names.user"),
    componentAdd: '',

  };
  Response: any;
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  rolesList:RoleDto[] = [];
  constructor(
    private roleService: RoleServiceProxy,
    private userService: UserServiceProxy,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private SharedServices: SharedService,private translate:TranslateService
  ) {
    this.defineuserForm();
  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getRoles();
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    if (this.currnetUrl == this.addUrl) {
      this.getuserCode();
    }
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        
        if (this.id) {
          this.getuserById(this.id);
        }
        this.url = this.router.url.split('/')[2];
      }
    });
  }

  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  defineuserForm() {
    this.userForm = this.fb.group({
      id: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      code: CODE_REQUIRED_VALIDATORS,
      isActive:true,
      fullName:NAME_REQUIRED_VALIDATORS,
      email:EMAIL_VALIDATORS,
      //passWord:new FormControl(''),
      phoneNumber:null,
      roles:''
    });
  }
  getRoles() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.roleService.allRoles(undefined, undefined, undefined,undefined,undefined).subscribe({
        next: (res) => {
        
          if (res) {
            this.rolesList = res.response.items;
        
          }


          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          console.log('complete');
        },
      });

      this.subsList.push(sub);
    });

  }
  //#endregion

  //#region CRUD Operations
  getuserById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.userService.getUser(id).subscribe({
        next: (res: any) => {
          console.log('result data getbyid', res);
          this.userForm.setValue({
            id: res.response?.id,
            nameAr: res.response?.nameAr,
            nameEn: res.response?.nameEn,
            code: res.response?.code,
            isActive:res.response?.isActive,
            fullName:res.response?.fullName,
            email:res.response?.email,
            //passWord:'',
             phoneNumber:res.response?.phoneNumber,
            roles:res.response?.roles
          });
          console.log(
            'this.userForm.value set value',
            this.userForm.value
          );
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          console.log('complete');
        },
      });
    });
    return promise;
  }
  showPassword() {
    this.show = !this.show;
  }
  getuserCode() {
    const promise = new Promise<void>((resolve, reject) => {
      this.userService.getLastCode().subscribe({
       
        next: (res: any) => {
          
          this.toolbarPathData.componentList=this.translate.instant("component-names.role");
          this.userForm.patchValue({
            code: res.response
          });

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          console.log('complete');
        },
      });
    });
  }
  //#endregion

  //#region Helper Functions

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  
  //#endregion
  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.SharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.SharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = 'Add user';
            this.defineuserForm();
            this.SharedServices.changeToolbarPath(this.toolbarPathData);
          } else if (currentBtn.action == ToolbarActions.Update) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.SharedServices.changeToolbarPath(this.toolbarPathData);
  }
  onSave() {
    if (this.userForm.valid) {
      const promise = new Promise<void>((resolve, reject) => {

        this.userService.createUser( this.userForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            console.log('result dataaddData ', result);
            this.Response = { ...result.response };
            this.defineuserForm();

            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
             
              navigateUrl(this.listUrl, this.router);
            }, 1000);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            console.log('complete');
          },
        });
      });
      return promise;

    } else {
     
    //  return this.userForm.markAllAsTouched();
    }
  }


  onUpdate() {
    
    if (this.userForm.valid) {

      this.userForm.value.id = this.id;
      console.log("this.VendorCommissionsForm.value", this.userForm.value)
      const promise = new Promise<void>((resolve, reject) => {
        this.userService.updateUser( this.userForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            console.log('result update ', result);
            this.Response = { ...result.response };
            this.defineuserForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
             
              navigateUrl(this.listUrl, this.router);
            }, 1000);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            console.log('complete');
          },
        });
      });
      return promise;
    }

    else {
   
     // return this.userForm.markAllAsTouched();
    }
  }

  //#endregion
}


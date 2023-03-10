import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../../common-services/shared-service';
import { Subscription } from 'rxjs';
import { ObjectIsNotNullOrEmpty } from '../../helper/helper';
import { ToolbarData } from '../../interfaces/toolbar-data';
import { ToolbarButtonsAppearance } from '../../interfaces/toolbar-buttons-appearance';
import { ToolbarPath } from '../../interfaces/toolbar-path'
import { enableDebugTools } from '@angular/platform-browser';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private SharedService: SharedService,
    private route: ActivatedRoute
  ) {
    this.showToolbarButtonsObj = {} as ToolbarButtonsAppearance;
  }

  showButtons!: ToolbarButtonsAppearance;

  disabledList = false;
  disabledSave = false;
  disabledUpate = false;
  disabledNew = false;
  disabledCopy = false;
  disabledDlete=false
  disabledCancel = false;
  disabledExport = false;
  disabledPrint = false;
  toolbarPathData!: ToolbarPath;
  toolbarData: ToolbarData = {} as ToolbarData;
  toolbarCompnentData: ToolbarData = {} as ToolbarData;
  substringUrl;
  showToolbarButtonsObj!: ToolbarButtonsAppearance;
  currentUrl;

  updateUrl;
  ngOnInit(): void {

    this.currentUrl = '';
    console.log('tooolbar url  ', this.router.url);
    this.currentUrl = this.router.url;
    this.toolbarData.componentName = this.currentUrl;
    this.SharedService.changeButton(this.toolbarData);
    this.substringUrl = this.currentUrl
      .substring(this.currentUrl.lastIndexOf('/') + 1)
      .trim();
    this.updateUrl = this.currentUrl.replace(this.substringUrl, '');
    this.listenToShowButton();
    this.listenToPathChange();
    this.listenClickedButton();
  }

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
  //
  //
  //#endregion

  //#region Toolbar Service
  subsList: Subscription[] = [];
  currentBtn!: string;

  listenToShowButton() {
    let sub = this.SharedService.getAppearanceButtons().subscribe({
      next: (showCurrentBtn: ToolbarButtonsAppearance) => {
        showCurrentBtn;

        if (ObjectIsNotNullOrEmpty(showCurrentBtn)) {
          this.showButtons = showCurrentBtn;
          this.resetCLickedButtons();
          console.log('showCurrentBtn', showCurrentBtn);
        } else {
          this.resetShowButtons();
        }
      },
    });
    this.subsList.push(sub);
  }

  listenClickedButton() {
    let sub = this.SharedService.getClickedbutton().subscribe({
      next: (toolbarCompnentData: ToolbarData) => {
        toolbarCompnentData;

        if (ObjectIsNotNullOrEmpty(toolbarCompnentData)) {
          this.toolbarCompnentData = toolbarCompnentData;
          if (this.toolbarCompnentData.action == 'New') {
            this.checkButtonClicked('New');
          }
          if (this.toolbarCompnentData.action == 'List') {
            this.checkButtonClicked('List');
          }
          if (this.toolbarCompnentData.action == 'Update') {
            this.checkButtonClicked('Update');
          }
          if (this.toolbarCompnentData.action == 'Delete') {
            this.checkButtonClicked('Delete');
          }


          console.log('toolbarCompnentData', toolbarCompnentData);
        }
      },
    });
    this.subsList.push(sub);
  }
  listenToPathChange() {

    let sub = this.SharedService.getToolbarPath().subscribe({
      next: (toolbarPathData: ToolbarPath) => {
        toolbarPathData;

        this.toolbarPathData = toolbarPathData;
        if (ObjectIsNotNullOrEmpty(toolbarPathData)) {
          if (
            this.toolbarPathData.listPath == this.currentUrl &&
            this.toolbarCompnentData.action == 'List'
          ) {
            this.checkButtonClicked('List');
          } else if (
            this.toolbarPathData.addPath == this.currentUrl &&
            this.toolbarCompnentData.action == 'New'
          ) {
            this.checkButtonClicked('New');
          } else if (
            this.toolbarPathData.updatePath == this.updateUrl &&
            this.toolbarCompnentData.action == 'Update'
          ) {
            this.checkButtonClicked('Update');
          }
          console.log('toolbarPathData', toolbarPathData);
        }
      },
    });
    this.subsList.push(sub);
  }

  doSaveEvent() {
    
    this.checkButtonClicked('Save');
    // (this.toolbarData.action = 'Save'),
    this.SharedService.changeButton({ action: 'Save' } as ToolbarData);
  }
  doUpdateEvent() {
    this.checkButtonClicked('Update');
    (this.toolbarData.action = 'Update'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doCopyEvent() {
    this.checkButtonClicked('Copy');
    (this.toolbarData.action = 'Copy'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doNewEvent() {
    this.checkButtonClicked('New');
    (this.toolbarData.action = 'New'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doCancelEvent() {
    this.checkButtonClicked('Cancel');
    (this.toolbarData.action = 'Cancel'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doExportEvent() {
    this.checkButtonClicked('Export');
    (this.toolbarData.action = 'Export'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doPrintEvent() {
    this.checkButtonClicked('Print');
    (this.toolbarData.action = 'Print'),
      this.SharedService.changeButton(this.toolbarData);
  }
  doDeleteEvent() {
    
    this.checkButtonClicked('Delete');
    (this.toolbarData.action = 'DeleteCheckList'),
      this.SharedService.changeButton(this.toolbarData);
      this.disabledDlete=true;
  }

  public goToList() {
    this.checkButtonClicked('List');
    (this.toolbarData.action = 'List'),
      this.SharedService.changeButton(this.toolbarData);
  }

  checkButtonClicked(button: string) {

    this.resetCLickedButtons();
    if (button == 'List') {
      this.disabledSave = true;
      this.disabledNew = false;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = false;
      this.disabledPrint = false;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disabledDlete=true;
    } else if (button == 'Save') {
      this.disabledUpate = true;
      this.disabledCopy = true;
      this.disabledNew = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledDlete=true;
    } else if (button == 'New') {
      this.disabledUpate = true;
      this.disabledCopy = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledDlete=true;
    } else if (button == 'Copy') {
    } else if (button == 'Update') {
      this.disabledSave = true;
    } else if (button == 'Cancel') {
    } else if (button == 'Print') {
    }
    else if(button=='Delete'){
      this.disabledUpate = true;
      this.disabledCopy = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledSave = true;
      this.disabledDlete=false;
    } 
  }

  resetCLickedButtons() {
    this.disabledSave = false;
    this.disabledNew = false;
    this.disabledCopy = false;
    this.disabledList = false;
    this.disabledExport = false;
    this.disabledPrint = false;
    this.disabledUpate = false;
  }
  resetShowButtons() {
    this.showToolbarButtonsObj.showSave = true;
    this.showToolbarButtonsObj.showCancel = true;
    this.showToolbarButtonsObj.showDelete = true;
    this.showToolbarButtonsObj.showExport = true;
    this.showToolbarButtonsObj.showCopy = true;
    this.showToolbarButtonsObj.showList = true;
    this.showToolbarButtonsObj.showNew = true;
    this.showToolbarButtonsObj.showPrint = true;
    this.showToolbarButtonsObj.showReset = true;
    this.showToolbarButtonsObj.showUpdate = true;
    this.SharedService.changeButtonApperance(this.showToolbarButtonsObj);
  }
}

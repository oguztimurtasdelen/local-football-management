import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";

import { StaffIzmirAskfModel } from "../../models/admin-staffizmiraskf.model";
import { StaffIASKFService } from "../../services/admin/admin-staffiaskf.service";
import { CreateAdminStaffIzmirAskfModal } from "../staff-izmiraskf-create/staff-izmiraskf-create.component";

@Component({
  selector: 'app-admin-staffizmiraskf',
  templateUrl: './staff-izmiraskf-list.component.html',
  styleUrls: ['../../../app.component.css', './staff-izmiraskf-list.component.css']
})
export class AdminStaffIzmirAskf implements OnInit, OnDestroy {
  headerTitle = "İZMİR AMATÖR SPOR KULÜPLERİ FEDERASYONU YÖNETİM KURULU";
  isLoading = false;
  staffizmiraskfList: StaffIzmirAskfModel[] = [];
  private staffizmiraskfListSub: Subscription;

  constructor(public staffService: StaffIASKFService, public dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true;
    this.staffService.getStaff();
    this.staffizmiraskfListSub = this.staffService.getStaffListUpdateListener()
      .subscribe((data: StaffIzmirAskfModel[]) => {
        this.staffizmiraskfList = data.sort((a, b) => { return a.order - b.order});
      });
    this.isLoading = false;
  }

  onDelete(id: number) {
    this.isLoading = true;
    this.staffService.deleteStaff(id);
    this.isLoading = false;
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateAdminStaffIzmirAskfModal, {
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.staffizmiraskfListSub = this.staffService.getStaffListUpdateListener()
      .subscribe((data: StaffIzmirAskfModel[]) => {
        this.staffizmiraskfList = data.sort((a, b) => { return a.order - b.order});
      });
    });
  }

  onEdit(staffInfo: StaffIzmirAskfModel) {
    console.log(staffInfo)
    const dialogRef = this.dialog.open(CreateAdminStaffIzmirAskfModal, {
      data: {
        mode: 'edit',
        staffInfo: staffInfo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.staffizmiraskfListSub = this.staffService.getStaffListUpdateListener()
      .subscribe((data: StaffIzmirAskfModel[]) => {
        this.staffizmiraskfList = data.sort((a, b) => { return a.order - b.order});
      });
    });
  }

  ngOnDestroy(): void {
    this.staffizmiraskfListSub.unsubscribe();
  }

}


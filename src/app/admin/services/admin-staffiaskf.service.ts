import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';

import { StaffIzmirAskfModel } from "../models/admin-staffizmiraskf.model";

import { globalFunctions } from "../../functions/global.function";

import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class StaffIASKFService {
  private staffList: StaffIzmirAskfModel[] = [];
  private staffListUpdated = new Subject<StaffIzmirAskfModel[]>();


  constructor(
    private http: HttpClient,
    private globalFunctions: globalFunctions
  ) {}

  getStaff() {
    this.http
      .get<{data: StaffIzmirAskfModel[]}>(
        environment.serverUrl + "admin/izmiraskf/staff"
      )
      .subscribe({
        next: (data) => {
          this.staffList = data.data;
          this.staffListUpdated.next([...this.staffList]);
        },
        error: (error) => {
          this.staffListUpdated.next(<StaffIzmirAskfModel[]>{});
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  getStaffListUpdateListener() {
    return this.staffListUpdated.asObservable();
  }

  createStaff(staffInfo: StaffIzmirAskfModel) {
    const formData = new FormData();
    formData.append('image', staffInfo.imageAttachment);
    formData.append('requestData', JSON.stringify(staffInfo));

    this.http
      .post<{data: StaffIzmirAskfModel}>(
        environment.serverUrl + "admin/izmiraskf/staff", formData
      )
      .subscribe({
        next: (responseData) => {
          this.staffList.push(responseData.data);
          this.staffListUpdated.next([...this.staffList]);
          this.globalFunctions.showSnackBar("system.success.create");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  updateStaff(staffInfo: StaffIzmirAskfModel) {
    const formData = new FormData();
    formData.append('image', staffInfo.imageAttachment);
    formData.append('requestData', JSON.stringify(staffInfo));

    this.http
      .put<{ data: StaffIzmirAskfModel }>(
        environment.serverUrl + "admin/izmiraskf/staff/" + staffInfo.id, formData
      )
      .subscribe({
        next: (responseData) => {
          // Replace updated object with the old one
          this.staffList.forEach((item, i) => {
            if (item.id == staffInfo.id) {
              this.staffList[i] = responseData.data;
            }
          });
          this.staffListUpdated.next([...this.staffList]);
          this.globalFunctions.showSnackBar("system.success.update");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  deleteStaff(staffId: number) {
    this.http
      .delete<{ }>(
        environment.serverUrl + "admin/izmiraskf/staff/" + staffId
      )
      .subscribe({
        next: (data) => {
          const filteredStaffList = this.staffList.filter(staffList => staffList.id !== staffId);
          this.staffList = filteredStaffList;
          this.staffListUpdated.next([...this.staffList]);
          this.globalFunctions.showSnackBar("system.success.delete");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }
}

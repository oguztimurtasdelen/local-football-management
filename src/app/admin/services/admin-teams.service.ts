import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { TeamsModel } from "../models/admin-teams.model";

import { globalFunctions } from "../../functions/global.function";

import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private teamsList: TeamsModel[] = [];
  private teamsCount: number = 0;
  private teamsListSub = new Subject<{teamsList: TeamsModel[], teamsCount: number}>();

  constructor(
    private http: HttpClient,
    private globalFunctions: globalFunctions
  ) {}

  getTeams(paginationPageSize?: number, paginationCurrentPage?: number) {
    this.http
      .get<{ data: {teamsList: TeamsModel[], teamsCount: number} }>(
        environment.serverUrl + `admin/teams?paginationPageSize=${paginationPageSize}&paginationCurrentPage=${paginationCurrentPage}`
      )
      .subscribe({
        next: (data) => {
          this.teamsList = data.data.teamsList;
          this.teamsCount = data.data.teamsCount;
          this.teamsListSub.next(data.data);
        },
        error: (error) => {
          this.teamsListSub.next({teamsList: <TeamsModel[]>{}, teamsCount: 0});
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  getTeamsListUpdateListener() {
    return this.teamsListSub.asObservable();
  }

  createTeam(teamInfo: TeamsModel) {
    const formData = new FormData();
    formData.append('image', teamInfo.imageAttachment);
    formData.append('requestData', JSON.stringify(teamInfo));

    this.http
      .post<{ data: TeamsModel }>(
        environment.serverUrl + "admin/teams", formData
      )
      .subscribe({
        next: (responseData) => {
          this.teamsList.push(responseData.data);
          this.teamsCount++;
          this.teamsListSub.next({teamsList: this.teamsList, teamsCount: this.teamsCount});
          this.globalFunctions.showSnackBar("system.success.create");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  updateTeam(teamInfo: TeamsModel) {
    const formData = new FormData();
    formData.append('image', teamInfo.imageAttachment);
    formData.append('requestData', JSON.stringify(teamInfo));

    this.http
      .put<{ data: TeamsModel }>(
        environment.serverUrl + "admin/teams/" + teamInfo.id, formData
      )
      .subscribe({
        next: (responseData) => {
          // Replace updated object with the old one
          this.teamsList.forEach((item, i) => {
            if (item.id == teamInfo.id) {
              this.teamsList[i] = responseData.data;
            }
          });
          this.teamsListSub.next({teamsList: this.teamsList, teamsCount: this.teamsCount});
          this.globalFunctions.showSnackBar("system.success.update");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  deleteTeam(teamId: number) {
    this.http
      .delete<{ }>(
        environment.serverUrl + "admin/teams/" + teamId
      )
      .subscribe({
        next: (data) => {
          const filteredteamsList = this.teamsList.filter(team => team.id !== teamId);
          this.teamsList = filteredteamsList;
          this.teamsCount--;
          this.teamsListSub.next({teamsList: this.teamsList, teamsCount: this.teamsCount});
          this.globalFunctions.showSnackBar("system.success.delete");
        },
        error: (error) => {
          this.globalFunctions.showSnackBar(error);
        }
      });
  }
}

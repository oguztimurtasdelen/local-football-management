import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { StadiumsModel } from "../../models/admin-stadiums.model";

@Injectable({providedIn: 'root'})
export class StadiumsService {
  private stadiumList: StadiumsModel[] = [];
  private stadiumListSub = new Subject<StadiumsModel[]>();

  constructor(private http: HttpClient) {}

  getStadiums() {
    try {
      this.http
        .get<{error: boolean, message: string, stadiums: StadiumsModel[]}>(
          'http://localhost:3000/admin/sahalar'
        )
        .subscribe((data) => {
          if (!data.error) {
            this.stadiumList = data.stadiums;
            this.stadiumListSub.next([...this.stadiumList]);
          } else {
            console.log(data.message);
          }

        });
    } catch (error) {
      console.log(error);
    }
  }

  getStadiumListUpdateListener() {
    return this.stadiumListSub.asObservable();
  }

  createStadium(stadiumInfo: StadiumsModel) {
    try {
      this.http
        .post<{error: boolean, message: string, stadiumId: number}>(
          'http://localhost:3000/admin/sahalar', stadiumInfo
        )
        .subscribe((data) => {
          if (!data.error) {
            console.log(data.message);
            console.log(data.stadiumId);
            stadiumInfo.id = data.stadiumId;
            this.stadiumList.push(stadiumInfo);
            this.stadiumListSub.next([...this.stadiumList]);
          } else {
            console.log(data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  updateStadium(stadiumInfo: StadiumsModel) {
    try {
      this.http
        .put<{error: boolean, message: string}>(
          'http://localhost:3000/admin/sahalar/' + stadiumInfo.id, stadiumInfo
        )
        .subscribe((data) => {
          if (!data.error) {
            // Replace updated object with the old one
            this.stadiumList.forEach((item, i) => {
              if (item.id == stadiumInfo.id) {
                this.stadiumList[i] = stadiumInfo;
              }
            });
            this.stadiumListSub.next([...this.stadiumList]);
          } else {
            console.log(data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  deleteStadium(stadiumId: number) {
    try {
      this.http
        .delete<{error: boolean, message: string}>(
          'http://localhost:3000/admin/sahalar/' + stadiumId
        )
        .subscribe((data) => {
          if (!data.error) {
            console.log(data.message);
            const filteredStadiumList = this.stadiumList.filter(stadium => stadium.id !== stadiumId);
            this.stadiumList = filteredStadiumList;
            this.stadiumListSub.next([...this.stadiumList]);
          }
          else {
            console.log(data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }


}

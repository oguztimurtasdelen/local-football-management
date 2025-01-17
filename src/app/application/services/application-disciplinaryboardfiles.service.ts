import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { DisciplinaryBoardFileModel } from "../models/application-disciplinaryboardfiles.model";

import { globalFunctions } from "../../functions/global.function";

import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DisciplinaryBoardFilesService {

  private disciplinaryBoardFileList: DisciplinaryBoardFileModel[] = [];
  private disciplinaryBoardFileListSub = new Subject<DisciplinaryBoardFileModel[]>();

  constructor(
    private http: HttpClient,
    private globalFunctions: globalFunctions
  ) {}

  getDisciplinaryBoardFiles(seasonId: number, caseType: string) {
    this.http
      .get<{ data: DisciplinaryBoardFileModel[] }>(
        environment.serverUrl + "disciplinary-board-files/" + seasonId + "/" + caseType
      )
      .subscribe({
        next: (data) => {
          this.disciplinaryBoardFileList = data.data;
          this.disciplinaryBoardFileList.length > 0 ? this.disciplinaryBoardFileListSub.next([...this.disciplinaryBoardFileList]) : this.disciplinaryBoardFileListSub.next([]);
        },
        error: (error) => {
          this.disciplinaryBoardFileListSub.next(<DisciplinaryBoardFileModel[]>{});
          this.globalFunctions.showSnackBar(error);
        }
      });
  }

  getDisciplinaryBoardFilesUpdateListener() {
    return this.disciplinaryBoardFileListSub.asObservable();
  }
}

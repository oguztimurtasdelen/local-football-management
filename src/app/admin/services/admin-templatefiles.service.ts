import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { TemplateFilesModel } from "../models/admin-templatefiles.model";

import { globalFunctions } from "../../functions/global.function";

@Injectable({providedIn: 'root'})
export class TemplateFilesService {
  private templateFilesList: TemplateFilesModel[] = [];
  private templateFilesListSub = new Subject<TemplateFilesModel[]>();

  constructor(
    private http: HttpClient,
    private globalFunctions: globalFunctions
    ) {}

  getTemplateFiles() {
    try {
      this.http
        .get<{templateFilesList: TemplateFilesModel[]}>(
          'http://localhost:3000/admin/template-files'
        )
        .subscribe({
          next: (data) => {
            this.templateFilesList = data.templateFilesList;
            this.templateFilesListSub.next([...this.templateFilesList]);
          },
          error: (error) => {
            this.globalFunctions.showSnackBar('server.error');
          }
        });
    } catch (error) {
      this.globalFunctions.showSnackBar('system.error');
    }
  }

  getDocumentsListUpdateListener() {
    return this.templateFilesListSub.asObservable();
  }

  updateDocument(templateFileInfo: TemplateFilesModel) {
    try {
      const formData = new FormData();
      formData.append('file', templateFileInfo.fileAttachment);
      formData.append('category', 'TEMPLATEFILES');
      formData.append('templateFileInfo', JSON.stringify(templateFileInfo));

      this.http
        .put<{ }>(
          'http://localhost:3000/admin/template-files/' + templateFileInfo.id, formData
        )
        .subscribe({
          next: (data) => {
            // Replace updated object with the old one
            this.templateFilesList.forEach((item, i) => {
              if (item.id == templateFileInfo.id) {
                this.templateFilesList[i] = templateFileInfo;
              }
            });
            this.templateFilesListSub.next([...this.templateFilesList]);
            this.globalFunctions.showSnackBar("server.success");
          },
          error: (error) => {
            this.globalFunctions.showSnackBar('server.error');
          }
        });
    } catch (error) {
      this.globalFunctions.showSnackBar('system.error');
    }
  }

}
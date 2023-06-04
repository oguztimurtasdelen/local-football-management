import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { ExternalLinksModel } from "../models/application-externallinks.model";

@Injectable({providedIn: 'root'})
export class ExternalLinksService {
  private extLinksList: ExternalLinksModel[] = [];
  private extLinksListSub = new Subject<ExternalLinksModel[]>();

  constructor(private http: HttpClient) {}

  getLinks() {
    try {
      this.http
        .get<{error: boolean, message: string, externalLinks: ExternalLinksModel[]}>(
          'http://localhost:3000/admin/disbaglantilar'
        )
        .subscribe({
          next: (data) => {
            if (!data.error) {
              this.extLinksList = data.externalLinks;
              this.extLinksListSub.next([...this.extLinksList]);
            } else {

            }
          },
          error: (error) => {

          }
        });
    } catch (error) {

    }
  }

  getExternalLinksSubListener() {
    return this.extLinksListSub.asObservable();
  }
}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';

import { AboutITFFModel } from "../models/application-aboutizmirtff.model";

import { globalFunctions } from "../../functions/global.function";

@Injectable({providedIn: 'root'})
export class AboutITFFService {
  private aboutContent: AboutITFFModel;
  private aboutContentSubject = new Subject<AboutITFFModel>();

  constructor(
    private http: HttpClient,
    private globalFunctions: globalFunctions
  ) {}

  getAboutContent() {
    try {
      this.http
        .get<{aboutContent: AboutITFFModel}>(
          'http://localhost:3000/tffiltemsilciligi/hakkimizda'
        )
        .subscribe({
          next: (data) => {
            this.aboutContent = data.aboutContent;
            this.aboutContentSubject.next(this.aboutContent);
          },
          error: (error) => {
            this.globalFunctions.showSnackBar('server.error');
          }
        });
    } catch (error) {

    }

  }

  getAboutContentListener() {
    return this.aboutContentSubject.asObservable();
  }
}

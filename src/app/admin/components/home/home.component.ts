import { Component } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE }  from "@angular/material/core";


@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../app.component.css', './home.component.css']
})
export class AdminHome {
  headerTitle = "ANA SAYFA";


}
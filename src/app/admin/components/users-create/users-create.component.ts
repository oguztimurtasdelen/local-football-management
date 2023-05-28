import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Data } from "@angular/router";

import { AuthService } from "../../authentication/auth.service";
import { UserModel } from "../../models/admin-users.model";

import { userAuthorityList } from "../../assets/lists/user-authority-list";
import { imageUploadValidator } from "../../validators/image-upload.validator";

@Component({
  selector: 'app-admin-users-create',
  templateUrl: './users-create.component.html',
  styleUrls:['../../../app.component.css', './users-create.component.css']
})
export class AdminUsersCreateModal implements OnInit, OnDestroy {
  isLoading = false;
  userSubmitForm: FormGroup;
  userAuthorityList = userAuthorityList;
  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<AdminUsersCreateModal>,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubmitForm = new FormGroup({
      id: new FormControl(null, {validators: []}),
      createdAt: new FormControl(null, {validators: []}),
      createdBy: new FormControl(null, {validators: []}),
      updatedAt: new FormControl(null, {validators: []}),
      updatedBy: new FormControl(null, {validators: []}),
      fullName: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)]}),
      userName: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)]}),
      userPassword: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)]}),
      profilePhoto: new FormControl(null, {validators: [], asyncValidators: [imageUploadValidator]}),
      userType: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)]}),
      isActive: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  onFilePicked(event: Event) {

    try {

      const file = (event.target as HTMLInputElement).files[0];
      this.userSubmitForm.patchValue({profilePhoto: file, fileName: 'test'});
      this.userSubmitForm.get('profilePhoto').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.log(error);
    }

  }

  onSubmitForm() {
    if (this.userSubmitForm.valid) {
      this.authService.createUser(this.userSubmitForm.value);

      this.dialogRef.close();
    } else {
      return null;
    }
  }

  ngOnDestroy(): void {

  }
}
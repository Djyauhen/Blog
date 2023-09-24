import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ServiceType} from "../../../../types/service.type";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RequestService} from "../../services/request.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  orderSending: boolean = false;
  serviceTypes = ServiceType;

  orderForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private requestService: RequestService) {
  }


  openPopup() {
    this.clearForm();
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick();
  }

  closePopup() {
    this.dialogRef?.close();
    this.orderSending = false;
    this.clearForm();
  }

  sendOrder() {
    if (this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone) {
      this.requestService.sendRequest({
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        type: "consultation"
      })
        .subscribe({
          next: (data) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message)
            } else {
              this._snackBar.open(data.message);
              this.orderSending = true;
              this.clearForm();
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        })
    }
  }

  clearForm() {
    this.orderForm.patchValue({
      name: '',
      phone: ''
    });
  }

}

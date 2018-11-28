import {Component, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'consultazioni-data-dialog',
    templateUrl: 'consultazioni-dialog.component.html',
  })
  export class ConsultazioniDataDialog {
    iscrizione:any;
    constructor(private dialogRef: MatDialogRef<ConsultazioniDataDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.iscrizione = data;
    }

    public closeDialog(){
        this.dialogRef.close();
      }

  }
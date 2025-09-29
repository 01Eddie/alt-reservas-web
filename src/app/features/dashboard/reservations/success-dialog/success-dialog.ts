import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  imports: [MatDialogModule],
  templateUrl: './success-dialog.html',
  styleUrl: './success-dialog.scss'
})
export class SuccessDialog {
  constructor(
    private dialogRef: MatDialogRef<SuccessDialog>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.dialogRef.getState() === 0) { // sigue abierto
        this.router.navigate(['/dashboard']);
        this.dialogRef.close();
      }
    }, 3000);
  }

  otraReserva() {
    this.dialogRef.close('otra');
  }
}

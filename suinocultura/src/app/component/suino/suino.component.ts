import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { SuinoService } from '../../service/suino.service';
import { SuinoFormComponent } from './suino-form/suino-form.component';

@Component({
  selector: 'app-suino',
  templateUrl: './suino.component.html',
  styleUrl: './suino.component.css'
})
export class SuinoComponent {
  spinner: boolean = true;

  constructor(
    private service: SuinoService,
    public dialog: MatDialog
  ) {
  }
  
  openDialog(element?: any): void {
    const dialogRef = this.dialog.open(SuinoFormComponent, {
      width: '600px',
      disableClose: true,
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner = false;
        console.log('The dialog was closed');
        console.log(element);
  
        setTimeout(() => {
          this.spinner = true;
        }, 1000);
      }
    });
  }

}

import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuinoService } from '../../../service/suino.service';

@Component({
  selector: 'app-suino-form',
  templateUrl: './suino-form.component.html',
  styleUrl: './suino-form.component.css'
})
export class SuinoFormComponent {
  @ViewChild('suinoFormRef') suinoFormRef: any;
  suinoForm: FormGroup;

  title = 'Cadastrar Suino';
  btnText = 'Cadastrar';
  snackBarDuration = 5000;

  constructor(
    private snackBar: MatSnackBar,
    private service: SuinoService,
    public dialogRef: MatDialogRef<SuinoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.suinoForm = new FormGroup({
      'id': new FormControl(null),
      'brincoAnimal': new FormControl(null, [
        this.brincoRequired,
        this.brincoNumeric, 
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]),
      'brincoPai': new FormControl(null, [
        this.brincoRequired,
        this.brincoNumeric,  
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]),
      'brincoMae': new FormControl(null, [
        this.brincoRequired,
        this.brincoNumeric, 
        Validators.required, 
        Validators.pattern(/^\d+$/)
      ]),
      'dataNascimento': new FormControl(null, [
        Validators.required
      ]),
      'dataSaida': new FormControl(null, [
        Validators.required
      ]),
      'status': new FormControl(null, [
        Validators.required
      ]),
      'sexo': new FormControl(null, [
        Validators.required
      ])
    });
  }

  brincoRequired(control: FormControl): { [key: string]: boolean } | null {
    const valor = control.value;

    if (!valor) {
      return { 'required': true };
    }

    return null;
  }
  
  brincoNumeric(control: FormControl): { [key: string]: boolean } | null {
    const valor = control.value;

    if (isNaN(valor)) {
      return { 'numeric': true };
    }

    return null;
  }
  

  get statusList(): any[] {
    return this.service.status;
  }

  get sexoList(): any[] {
    return this.service.sexo;
  }

  onSubmit(): void {
    console.log('submit');
    console.log('suinoform: ', this.suinoForm.value);

    if (this.suinoForm.invalid) {
      console.log('form invalido');
      this.openSnackBar('Por favor, preencha o formulário corretamente.');
      return;
    }

    this.service.save(this.suinoForm.value);
    this.openSnackBar();
  }

  openSnackBar (msg: string = 'Cadastrado com sucesso!'): void {
    this.snackBar.open(msg, 'X', {
      duration: this.snackBarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}

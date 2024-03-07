import { Injectable } from '@angular/core';
import { SexoDescricaoEnum, SexoEnum } from '../enum/sexo.enum';
import { StatusDescricaoEnum, StatusEnum } from '../enum/status.enum';
import { SuinoFormDTO } from '../model/suino/suino-form.dto';

@Injectable({
  providedIn: 'root'
})
export class SuinoService {
  private _sexo: any[] = [
    {value: '', viewValue: 'Selecione...'},
    {value: SexoEnum.FEMEA, viewValue: SexoDescricaoEnum.FEMEA},
    {value: SexoEnum.MACHO, viewValue: SexoDescricaoEnum.MACHO},
  ];

  private _status: any[] = [
    {value: '', viewValue: 'Selecione...'},
    {value: StatusEnum.ATIVO, viewValue: StatusDescricaoEnum.ATIVO},
    {value: StatusEnum.MORTO, viewValue: StatusDescricaoEnum.MORTO},
    {value: StatusEnum.VENDIDO, viewValue: StatusDescricaoEnum.VENDIDO},
  ];

  constructor() { }

  receberDadosFormulario(form: any) {
    let formSuino: SuinoFormDTO = form.value;

    console.log('[SuinoService] formSuino: ', formSuino);
  }

  get sexo(): any[] {
    return this._sexo;
  }

  get status(): any[] {
    return this._status;
  }

}

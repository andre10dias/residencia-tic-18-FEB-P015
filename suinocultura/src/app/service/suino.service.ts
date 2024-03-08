import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, map } from 'rxjs';

import { SexoDescricaoEnum, SexoEnum } from '../enum/sexo.enum';
import { StatusDescricaoEnum, StatusEnum } from '../enum/status.enum';

import { FirebaseCredentials } from '../model/firebase/firebase-credentials';
import { SuinoUtil } from '../util/suino.util';

import { Suino } from '../model/suino/suino';
import { SuinoCreateDTO } from '../model/suino/suino-create.dto';
import { SuinoListDTO } from '../model/suino/suino-list.dto';
import { SuinoEditDTO } from '../model/suino/suino-edit.dto';

@Injectable({
  providedIn: 'root'
})
export class SuinoService {
  fire: FirebaseCredentials = new FirebaseCredentials();
  baseUrl: string = `${this.fire.baseUrl}/suino`;
  
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

  private novoSuinoSubject = new Subject<any>();
  private novoSuino: SuinoListDTO = {} as SuinoListDTO;
  private _suinoAtualizado: SuinoListDTO = {} as SuinoListDTO;

  constructor(
    private http: HttpClient,
    private util: SuinoUtil
  ) { }

  novoSuinoAdicionado() {
    setTimeout(() => {
      this.novoSuinoSubject.next(this.novoSuino);
    }, 1000);
  }

  get novoSuinoObservable() {
    return this.novoSuinoSubject.asObservable();
  }

  get suinoAtualizado() {
    return this._suinoAtualizado;
  }

  getAll(): Observable<Suino[]> {
    return this.http.get<{ [key: string]: Suino }>(`${this.baseUrl}.json`).pipe(
      map(data => {
        const listaSuino: Suino[] = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            listaSuino.push({ ...(data as any)[key], id: key });
          }
        }

        return listaSuino;
      })
    );
  }

  getSuinoById(id: string): Observable<Suino> {
    return this.http.get<Suino>(`${this.baseUrl}/${id}.json`).pipe(
      map((data: any) => {
        data.id = data.name;
        return data as Suino;
      })
    );
  }

  save(form: any) {
    let [anoNasc, mesNasc, diaNasc] = form.dataNascimento.split('-');
    const dataNascimento = new Date(Number(anoNasc), Number(mesNasc) - 1, Number(diaNasc));
    
    let [anoSai, mesSai, diaSai] = form.dataSaida.split('-');
    const dataSaida = new Date(Number(anoSai), Number(mesSai) - 1, Number(diaSai));

    let create: SuinoCreateDTO = {
      id: null,
      brincoAnimal: form.brincoAnimal,
      brincoMae: form.brincoMae,
      brincoPai: form.brincoPai,
      dataNascimento: dataNascimento,
      dataSaida: dataSaida,
      status: form.status,
      sexo: form.sexo,
      createAt: new Date()
    }

    this.http.post(`${this.baseUrl}.json`, create).subscribe({
      next: (data: any) => {
        this.novoSuino = {
          id: data.name,
          brincoAnimal: create.brincoAnimal,
          brincoMae: create.brincoMae,
          brincoPai: create.brincoPai,
          dataNascimento: this.util.formatarData(create.dataNascimento, 'dd/MM/yyyy'),
          dataSaida: this.util.formatarData(create.dataSaida, 'dd/MM/yyyy'),
          status: create.status,
          sexo: create.sexo
        };
      },
      error: (error: any) => {
        console.log('error: ', error)
      }
    });
  }

  receberDadosFormularioEdit(form: any): void {
    let [anoNasc, mesNasc, diaNasc] = form.dataNascimento.split('-');
    const dataNascimento = new Date(Number(anoNasc), Number(mesNasc) - 1, Number(diaNasc));
    
    let [anoSai, mesSai, diaSai] = form.dataSaida.split('-');
    const dataSaida = new Date(Number(anoSai), Number(mesSai) - 1, Number(diaSai));

    let edit: SuinoEditDTO = {
      id: form.id,
      brincoAnimal: form.brincoAnimal,
      brincoPai: form.brincoPai,
      brincoMae: form.brincoMae,
      dataNascimento: dataNascimento,
      dataSaida: dataSaida,
      status: form.status,
      sexo: form.sexo,
      updateAt: new Date()
    }

    this.http.put(`${this.baseUrl}/${form.id}.json`, edit).subscribe({
      next: (data: any) => {
        this._suinoAtualizado = {
          id: data.id,
          brincoAnimal: edit.brincoAnimal,
          brincoPai: edit.brincoPai,
          brincoMae: edit.brincoMae,
          dataNascimento: this.util.formatarData(edit.dataNascimento, 'dd/MM/yyyy'),
          dataSaida: this.util.formatarData(edit.dataSaida, 'dd/MM/yyyy'),
          status: edit.status,
          sexo: edit.sexo
        };
      },
      error: (error: any) => {
        console.log('error: ', error)
      }
    });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}.json`).subscribe({
      next: (data: any) => {
        // console.log(data);
      },
      error: (error: any) => {
        console.log('error: ', error)
      }
    });
  }

  retornarIdade(dataNascimento: string): string {
    if (!dataNascimento) return '';

    let data = this.util.stringToDate(dataNascimento);

    if (!data) return '';

    const hoje = new Date();
    const nascimento = new Date(data);

    let idadeEmMeses = (hoje.getFullYear() - nascimento.getFullYear()) * 12;
    idadeEmMeses -= nascimento.getMonth();
    idadeEmMeses += hoje.getMonth();

    if (hoje.getDate() < nascimento.getDate()) {
      idadeEmMeses--;
    }

    return idadeEmMeses.toString();
  }

  get sexo(): any[] {
    return this._sexo;
  }

  get status(): any[] {
    return this._status;
  }

}

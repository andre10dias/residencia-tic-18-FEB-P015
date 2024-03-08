import { Pipe, PipeTransform } from '@angular/core';
import { SuinoService } from '../service/suino.service';

@Pipe({
  name: 'idade'
})
export class IdadePipe implements PipeTransform {

  constructor(private service: SuinoService) { }

  transform(dataNascimento: string): string {
    return this.service.retornarIdade(dataNascimento) + ' meses';
  }

}

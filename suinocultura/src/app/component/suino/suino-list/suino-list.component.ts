import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';

import { SuinoService } from '../../../service/suino.service';
import { SuinoUtil } from '../../../util/suino.util';
import { SuinoConverter } from '../../../model/suino/suino.converter';

import { SuinoListDTO } from '../../../model/suino/suino-list.dto';
import { DialogComponent } from '../../dialog/dialog.component';
import { SuinoFormDTO } from '../../../model/suino/suino-form.dto';
import { SuinoFormComponent } from '../suino-form/suino-form.component';
import { ActionEnum } from '../../../enum/action-enum';
// import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-suino-list',
  templateUrl: './suino-list.component.html',
  styleUrl: './suino-list.component.css'
})
export class SuinoListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  listaSuinos: SuinoListDTO[] = [];
  dadosCarregados: boolean = false;
  spinner: boolean = false;
  screenWidth: number = window.innerWidth;
  
  displayedColumns: string[] = ['brincoAnimal', 'brincoPai', 'brincoMae', 
    'dataNascimento', 'dataSaida', 'status', 'sexo', 'idade', 'action'];

  dataSource = new MatTableDataSource<SuinoListDTO>();
  sortedData: SuinoListDTO[] = [];

  title: string = 'Excluir atendimento';
  removeTemplate: string = '<div>Tem certeza que deseja remover?</div>';

  constructor(
    private service: SuinoService,
    private converter: SuinoConverter,
    private util: SuinoUtil,
    public dialog: MatDialog
  ) {
    this.carregardadosList();
  }

  ngOnInit(): void {
    this.service.novoSuinoObservable.subscribe({
      next: (suino: SuinoListDTO) => {
        this.dataSource.data.push(suino);
        this.dataSource._updateChangeSubscription();
      }
    });

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };

    // if (this.isScreenSmall()) {
    //   this.displayedColumns = ['brincoAnimal', 'brincoPai', 'brincoMae', 
    //   'dataNascimento', 'dataSaida', 'status', 'sexo', 'idade', 'action'];
    // }
  }
  
  carregardadosList(): void {
    this.service.getAll().subscribe({
      next: suimos => {
        this.spinnerOn();
        this.listaSuinos = this.converter.toListSuinoListDTOs(suimos);
        this.dataSource = new MatTableDataSource<SuinoListDTO>(this.listaSuinos);
        this.sortedData = this.listaSuinos.slice();
        // this.dadosCarregados = true;
        // console.log('[suimos-list] carregarsuimos: ', this.listaSuinos);
        
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          let label = document.querySelector('#mat-paginator-page-size-label-0') as HTMLElement;
          // let label2 = document.querySelector('.mat-mdc-paginator-range-label') as HTMLElement;
          
          if (label) {
            label.innerHTML = 'Itens por página:';
          }
        }, 200);

        this.spinnerOff();
      },
      error: error => {
        console.error('Erro ao carregar suimos:', error);
      }
    });
  }

  openDialog(element?: SuinoFormDTO): void {
    const dialogRef = this.dialog.open(SuinoFormComponent, {
      width: '600px',
      disableClose: true,
      data: { 
        element: element, 
        action: ActionEnum.EDIT, 
        title: 'Editar Suíno', 
        txtButton: 'Editar' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerOn();
        const index = this.dataSource.data.findIndex(item => item.id === element?.id);

        if (index !== -1) {
          setTimeout(() => {
            let suino = this.service.suinoAtualizado;
            this.dataSource.data[index] = suino;
            this.dataSource._updateChangeSubscription();
            this.dadosCarregados = true;
          }, 1000);
        }

        this.spinnerOff();
      }
    });
  }

  editItem(id: string): void {
    this.service.getSuinoById(id).subscribe(suino => {
      if (suino) {
        suino.id = id;
        let suinoFormDTO: SuinoFormDTO = this.converter.toSuinoFormDTO(suino);
        this.openDialog(suinoFormDTO);
      }
    });
  }

  removeItem(id: string): void {
    this.service.delete(id);
    const index = this.dataSource.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  openConfirmDialog(
    element?: any, 
    template: string = this.removeTemplate, 
    title: string = this.title
  ): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      disableClose: true,
      data: {title, template, element}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerOn();
        this.removeItem(element);
        this.spinnerOff();
      }
    });
  }

  sortData(sort: Sort) {
    // const data = this.listaSuinos.slice();
    const data = this.dataSource.data.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'brincoAnimal':
          return this.util.compare(a.brincoAnimal, b.brincoAnimal, isAsc);
        case 'brincoPai':
          return this.util.compare(a.brincoPai, b.brincoPai, isAsc);
        case 'brincoMae':
          return this.util.compare(a.brincoMae, b.brincoMae, isAsc);
        case 'dataNascimento':
          return this.util.compareDates(a.dataNascimento, b.dataNascimento, isAsc);
        case 'dataSaida':
          return this.util.compareDates(a.dataSaida, b.dataSaida, isAsc);
        case 'status':
          return this.util.compare(a.status, b.status, isAsc);
        case 'sexo':
          return this.util.compare(a.sexo, b.sexo, isAsc);
        case 'idade':
          let idadeA = +this.service.retornarIdade(a.dataNascimento);
          let idadeB = +this.service.retornarIdade(b.dataNascimento);
          return this.util.compare(idadeA, idadeB, isAsc);
        default:
          return this.util.compareDates(a.createdAt, b.createdAt, isAsc);
      }
    });
  }

  // isScreenSmall(): boolean {
  //   return this.screenWidth <= 500;
  // }

  spinnerOn(): void {
    this.spinner = false;
  }

  spinnerOff(): void {
    setTimeout(() => {
      this.spinner = true;
    }, 1000);
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuinoComponent } from './component/suino/suino.component';
import { PesoComponent } from './component/peso/peso.component';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'suino', component: SuinoComponent },
  { path: 'peso', component: PesoComponent },
  // { path: 'home', component: HomeComponent, canActivate: [AtendimentoGuard] },
  // { path: 'atendimentos', component: AtendimentosComponent, canActivate: [AtendimentoGuard] },
  // { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'login' },
  // { path: 'login', component: LoginComponent },
  // { path: 'home', component: HomeComponent, canActivate: [AtendimentoGuard] },
  // { path: 'atendimentos', component: AtendimentosComponent, canActivate: [AtendimentoGuard] },
  // { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

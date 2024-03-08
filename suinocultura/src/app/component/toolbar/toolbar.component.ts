import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  constructor(
    // private route: Router,
    // private service: AuthService
  ) { }

  // rotaHome() {
  //   this.route.navigate(['/home']);
  // }

  // rotaAtendimentos() {
  //   this.route.navigate(['/atendimentos']);
  // }

  // sair() {
  //   localStorage.clear();
  //   this.service.logout();
  //   this.route.navigate(['/login']);
  // }

}

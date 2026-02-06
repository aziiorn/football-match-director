import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToOdds() {
    this.router.navigate(['/odds']);
  }

  goToTeams() {
    this.router.navigate(['/teams']);
  }

  goToPlayers() {
    this.router.navigate(['/players']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToDirect() {
    this.router.navigate(['/match/direct']);
  }

  goToMyBets() {
    this.router.navigate(['/bets']);
  }
}

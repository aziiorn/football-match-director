import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  players: any[] = [];
  upcomingMatches: any[] = [];
  ongoingMatches: any[] = [];
  finishedMatches: any[] = [];
  teamsMap: { [key: number]: string } = {};

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getPlayers().subscribe({
      next: data => this.players = data,
      error: err => console.error('Erreur chargement joueurs', err)
    });

    this.api.getTeams().subscribe({
      next: teams => {
        this.teamsMap = teams.reduce((acc: any, t: any) => {
          acc[t.id] = t.name;
          return acc;
        }, {});
      },
      error: err => console.error('Erreur chargement équipes', err)
    });

    this.api.getMatches().subscribe({
      next: matches => {
        this.upcomingMatches = matches
          .filter(m => m.status === 'upcoming')
          .map(m => this.enrichMatch(m));

        this.ongoingMatches = matches
          .filter(m => m.status === 'ongoing')
          .map(m => this.enrichMatch(m));

        this.finishedMatches = matches
          .filter(m => m.status === 'finished')
          .map(m => this.enrichMatch(m));
      },
      error: err => console.error('Erreur chargement matchs', err)
    });
  }

  enrichMatch(m: any) {
    return {
      ...m,
      homeTeamName: this.getTeamName(m.home_team_id),
      awayTeamName: this.getTeamName(m.away_team_id)
    };
  }

  getScoreClass(match: any): string {
    if (match.homeTeamScore === match.awayTeamScore) return 'score draw';
    return match.homeTeamScore > match.awayTeamScore ? 'score win' : 'score lose';
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  getLogoSrc(teamName: string): string {
    return `assets/logo/${teamName}.png`;
  }
}

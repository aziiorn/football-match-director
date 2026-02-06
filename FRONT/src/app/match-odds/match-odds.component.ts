import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-odds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-odds.component.html',
  styleUrls: ['./match-odds.component.scss']
})
export class MatchOddsComponent implements OnInit {
  ongoingMatches: any[] = [];
  upcomingMatches: any[] = [];
  teamsMap: { [id: number]: string } = {};

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getTeams().subscribe({
      next: teams => {
        this.teamsMap = teams.reduce((map: any, t: any) => {
          map[t.id] = t.name;
          return map;
        }, {});
      },
      error: err => console.error('Erreur chargement équipes', err)
    });

    this.api.getMatches().subscribe({
      next: async matches => {
        const filteredMatches = matches.filter(m => m.status === 'upcoming' || m.status === 'ongoing');

        const enrichedMatches = await Promise.all(filteredMatches.map(async match => {
          const odds = await this.api.getOdds(match.id).toPromise();
          return {
            ...match,
            homeTeamName: this.getTeamName(match.home_team_id),
            awayTeamName: this.getTeamName(match.away_team_id),
            odds
          };
        }));

        this.ongoingMatches = enrichedMatches.filter(m => m.status === 'ongoing');
        this.upcomingMatches = enrichedMatches.filter(m => m.status === 'upcoming');
      },
      error: err => console.error('Erreur chargement matchs', err)
    });
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  getLogoSrc(teamName: string): string {
    return `assets/logo/${teamName}.png`;
  }

  placeBet(matchId: number) {
    this.router.navigate(['/bets', matchId]);
  }
}

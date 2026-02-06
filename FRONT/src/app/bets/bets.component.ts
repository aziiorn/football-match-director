import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit {
  pendingBets: any[] = [];
  wonBets: any[] = [];
  lostBets: any[] = [];
  totalGains = 0;
  totalPertes = 0;
  balance = 0;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.api.getUserBets().subscribe(async bets => {
      const matches = await this.api.getMatches().toPromise();
      if (!matches) return;

      for (const bet of bets) {
        const match = matches.find(m => m.id === bet.match_id);
        if (match) {
          // Si les noms ne sont pas déjà présents, on les récupère
          if (!match.homeTeamName) {
            const team = await this.api.getTeamById(match.home_team_id).toPromise();
            if (!team) return;
            match.homeTeamName = team.name;
          }

          if (!match.awayTeamName) {
            const team = await this.api.getTeamById(match.away_team_id).toPromise();
            if (!team) return;
            match.awayTeamName = team.name;
          }

          bet.match = match;
        }
      }

      this.pendingBets = bets.filter(b => b.status === 'pending');
      this.wonBets = bets.filter(b => b.status === 'won');
      this.lostBets = bets.filter(b => b.status === 'lost');

      this.totalGains = this.wonBets.reduce((sum, bet) => sum + bet.amount * bet.odds_at_bet_time, 0);
      this.totalPertes = this.lostBets.reduce((sum, bet) => sum + bet.amount, 0);
      this.balance = this.totalGains - this.totalPertes;
    });
  }



  formatBetType(betType: string, match: any): string {
    if (!match) return '';
    const home = match.homeTeamName || match.home_team?.name || 'Équipe A';
    const away = match.awayTeamName || match.away_team?.name || 'Équipe B';
    if (betType === 'home_win') return `Victoire de ${home}`;
    if (betType === 'away_win') return `Victoire de ${away}`;
    return 'Match nul';
  }

  getMatchLabel(match: any): string {
    const home = match.homeTeamName || match.home_team?.name || 'Équipe A';
    const away = match.awayTeamName || match.away_team?.name || 'Équipe B';
    return `${home} vs ${away}`;
  }
}

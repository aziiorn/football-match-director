import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss']
})
export class BetComponent implements OnInit {
  matchId!: number;
  match: any;
  amount: number = 0;
  betType: 'home_win' | 'draw' | 'away_win' = 'home_win';
  teamsMap: { [key: number]: string } = {};
  betSuccessMessage: string | null = null;
  betError: boolean = false;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getMatchById(this.matchId).subscribe({
      next: match => {
        this.match = match;

        this.api.getOdds(this.matchId).subscribe({
          next: odds => this.match.odds = odds,
          error: err => console.error('Erreur chargement cotes', err)
        });
      },
      error: err => console.error('Erreur chargement match', err)
    });

    this.api.getTeams().subscribe(teams => {
      this.teamsMap = teams.reduce((acc: any, team: any) => {
        acc[team.id] = team.name;
        return acc;
      }, {});
    });
  }

  submitBet() {
    this.api.createBet({
      matchId: this.matchId,
      betType: this.betType,
      amount: this.amount
    }).subscribe({
      next: () => {
        this.betSuccessMessage = '✅ Pari placé avec succès !';
        this.betError = false;
        setTimeout(() => {
          this.betSuccessMessage = null;
          this.router.navigate(['/odds']);
        }, 1500);
      },
      error: err => {
        const msg = err?.error?.error || err?.error?.message || err.message || 'Erreur inconnue.';
        this.betSuccessMessage = '❌ Erreur : ' + msg;
        this.betError = true;
        setTimeout(() => this.betSuccessMessage = null, 4000);
      }
    });
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  isScoreVisible(): boolean {
    return this.match?.status === 'ongoing' || this.match?.status === 'finished';
  }
}

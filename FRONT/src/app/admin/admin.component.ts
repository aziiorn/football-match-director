import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  teams: any[] = [];
  selectedTeam: any;
  selectedPlayer: any;
  selectedMatchId: number | undefined;
  matches: any[] = [];
  players: any[] = [];
  selectedMatch: any;
  successMessage: string | null = null;
  allMatches: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTeams().subscribe((teams: any[]) => {
      this.teams = teams;
    });

    this.api.getMatches().subscribe(async (matches: any[]) => {
      const matchPromises = matches
        .filter(m => m.status !== 'finished')
        .map(match =>
          Promise.all([
            this.api.getTeamById(match.home_team_id).toPromise(),
            this.api.getTeamById(match.away_team_id).toPromise()
          ]).then(([homeTeam, awayTeam]) => {
            match.homeTeamName = homeTeam?.name ?? 'Équipe A';
            match.awayTeamName = awayTeam?.name ?? 'Équipe B';
            return match;
          })
        );

      this.allMatches = await Promise.all(matchPromises);
    });
  }

  onTeamSelected() {
    if (this.selectedTeam) {
      this.api.getMatchesByTeam(this.selectedTeam.id).subscribe((matches: any[]) => {
        const matchPromises = matches
          .filter(match => match.status === 'ongoing')
          .map(match => {
            return this.api.getTeamById(match.home_team_id).toPromise().then(homeTeam => {
              return this.api.getTeamById(match.away_team_id).toPromise().then(awayTeam => {
                if (homeTeam && awayTeam) {
                  match.homeTeamName = homeTeam.name;
                  match.awayTeamName = awayTeam.name;
                } else {
                  console.error('Une des équipes est manquante pour ce match', match);
                }
                return match;
              }).catch(error => {
                console.error('Erreur lors de la récupération de awayTeam:', error);
                return match;
              });
            }).catch(error => {
              console.error('Erreur lors de la récupération de homeTeam:', error);
              return match;
            });
          });

        Promise.all(matchPromises).then(updatedMatches => {
          this.matches = updatedMatches;
          this.players = [];
          this.selectedMatchId = undefined;
          this.selectedPlayer = undefined;
        });
      });
    }
  }

  onMatchSelected() {
    if (this.selectedMatch) {
      this.selectedMatchId = this.selectedMatch.id;

      if (this.selectedMatch.homeTeamName === this.selectedTeam.name) {
        this.players = this.selectedMatch.homePlayers || [];
      } else if (this.selectedMatch.awayTeamName === this.selectedTeam.name) {
        this.players = this.selectedMatch.awayPlayers || [];
      }

      this.api.getPlayersByTeam(this.selectedTeam.id).subscribe((players: any[]) => {
        this.players = players;
      });
    }
  }

  publishGoal() {
    if (this.selectedMatchId === undefined) {
      console.error('Veuillez sélectionner un match');
      return;
    }

    const goalData = {
      matchId: this.selectedMatchId,
      team: this.selectedTeam,
      playerId: this.selectedPlayer
    };

    this.api.publishGoal(goalData).subscribe({
      next: response => {
        console.log('But publié:', response);
        this.successMessage = '✅ Le but a bien été publié !';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: err => {
        console.error('Erreur publication du but :', err);
        this.successMessage = '❌ Erreur lors de la publication du but.';
        setTimeout(() => this.successMessage = null, 4000);
      }
    });
  }

  statusMatch: any = null;
  newStatus: string = '';
  statusMessage: string | null = null;

  onStatusMatchSelected(match: any) {
    this.statusMatch = match;
    if (match?.status === 'upcoming') {
      this.newStatus = 'ongoing';
    } else if (match?.status === 'ongoing') {
      this.newStatus = 'finished';
    } else {
      this.newStatus = '';
    }
  }

  updateMatchStatus() {
    if (!this.statusMatch) return;

    const matchId = this.statusMatch.id;
    const currentStatus = this.statusMatch.status;

    const nextStatus = currentStatus === 'upcoming' ? 'ongoing' :
      currentStatus === 'ongoing' ? 'finished' : null;

    if (!nextStatus) return;

    const updatedData = { status: nextStatus };

    this.api.updateMatch(matchId, updatedData).subscribe({
      next: () => {
        this.statusMessage = `✅ Match mis à jour : ${this.getStatusLabel(nextStatus)}.`;
        setTimeout(() => this.statusMessage = null, 3000);

        this.statusMatch.status = nextStatus;
        this.onTeamSelected();
      },
      error: err => {
        console.error('Erreur mise à jour statut :', err);
        this.statusMessage = '❌ Erreur lors de la mise à jour.';
        setTimeout(() => this.statusMessage = null, 4000);
      }
    });
  }

  getStatusLabel(status: string): string {
    if (status === 'upcoming') return 'À venir';
    if (status === 'ongoing') return 'En cours';
    if (status === 'finished') return 'Terminé';
    return status;
  }
}

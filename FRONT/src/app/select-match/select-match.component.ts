import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { Match } from '../models/match';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-match',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select-match.component.html',
  styleUrls: ['./select-match.component.scss']
})
export class SelectMatchComponent implements OnInit {
  matches: Match[] = [];
  selectedMatchId: number | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getMatches().subscribe({
      next: (data) => {
        this.matches = data.filter(match => match.status === 'ongoing');

        for (let match of this.matches) {
          this.apiService.getTeamById(match.home_team_id).subscribe({
            next: (team) => match.homeTeamName = team.name,
            error: (err) => console.error(`Erreur chargement équipe ${match.home_team_id}`, err)
          });

          this.apiService.getTeamById(match.away_team_id).subscribe({
            next: (team) => match.awayTeamName = team.name,
            error: (err) => console.error(`Erreur chargement équipe ${match.away_team_id}`, err)
          });
        }
      },
      error: (err) => console.error('Erreur chargement matchs', err)
    });
  }

  goToLiveMatch(): void {
    if (this.selectedMatchId) {
      this.router.navigate(['/match/direct', this.selectedMatchId]);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  teamId: number | undefined;
  team: any = {};
  upcomingMatches: any[] = [];
  ongoingMatches: any[] = [];
  finishedMatches: any[] = [];
  players: any[] = [];
  teamsMap: { [key: number]: string } = {};

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.teamId = +this.route.snapshot.paramMap.get('id')!;
    this.api.getTeamById(this.teamId).subscribe(team => this.team = team);

    this.api.getTeams().subscribe({
      next: teams => {
        this.teamsMap = teams.reduce((acc: any, t: any) => {
          acc[t.id] = t.name;
          return acc;
        }, {});
      },
      error: err => console.error('Erreur chargement équipes', err)
    });

    this.api.getMatchesByTeam(this.teamId).subscribe(matches => {
      const teamMatches = matches.filter((m: any) =>
        m.home_team_id === this.teamId || m.away_team_id === this.teamId
      );

      this.upcomingMatches = this.addTeamNamesToMatches(teamMatches.filter((m: any) => m.status === 'upcoming'));
      this.ongoingMatches = this.addTeamNamesToMatches(teamMatches.filter((m: any) => m.status === 'ongoing'));
      this.finishedMatches = this.addTeamNamesToMatches(teamMatches.filter((m: any) => m.status === 'finished'));
    });

    this.api.getPlayersByTeam(this.teamId).subscribe(players => this.players = players);
  }

  addTeamNamesToMatches(matches: any[]) {
    return matches.map((match: any) => ({
      ...match,
      homeTeamName: this.getTeamName(match.home_team_id),
      awayTeamName: this.getTeamName(match.away_team_id)
    }));
  }

  goToPlayerDetails(playerId: number) {
    this.router.navigate([`/players/${playerId}`]);
  }

  getScoreClass(match: any): string {
    if (match.home_team_id === this.teamId) {
      if (match.homeTeamScore > match.awayTeamScore) return 'score win';
      if (match.homeTeamScore < match.awayTeamScore) return 'score lose';
    } else {
      if (match.awayTeamScore > match.homeTeamScore) return 'score win';
      if (match.awayTeamScore < match.homeTeamScore) return 'score lose';
    }
    return 'score draw';
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  getLogoSrc(teamName: string): string {
    return `assets/logo/${teamName}.png`;
  }
}

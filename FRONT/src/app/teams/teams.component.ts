import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  teamsMap: { [key: number]: string } = {};

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.api.getTeams().subscribe({
      next: teams => this.teams = teams,
      error: err => console.error('Erreur chargement équipes', err)
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
  }

  goToTeamDetails(teamId: number) {
    this.router.navigate([`/teams/${teamId}`]);
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  getLogoSrc(teamName: string): string {
    return `assets/logo/${teamName}.png`;
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  imports: [CommonModule, FormsModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  filteredPlayers: any[] = [];
  teamsMap: { [key: number]: string } = {};
  searchQuery: string = '';

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.api.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.filteredPlayers = players;
      },
      error: (err) => console.error('Erreur chargement joueurs', err)
    });

    this.api.getTeams().subscribe({
      next: (teams) => {
        this.teamsMap = teams.reduce((acc: any, team: any) => {
          acc[team.id] = team.name;
          return acc;
        }, {});
      },
      error: (err) => console.error('Erreur chargement équipes', err)
    });
  }

  getTeamName(id: number): string {
    return this.teamsMap[id] || `Équipe ${id}`;
  }

  filterPlayers(): void {
    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      this.getTeamName(player.team_id).toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  goToPlayerDetails(playerId: number): void {
    this.router.navigate([`/players/${playerId}`]);
  }
}
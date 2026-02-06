import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, of, Subscription, forkJoin } from 'rxjs';
import { MatchService } from '../match-service.service';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-match-direct',
  imports: [CommonModule],
  templateUrl: './match-direct.component.html',
  styleUrls: ['./match-direct.component.scss'],
})
export class MatchDirectComponent implements OnInit, OnDestroy {
  goals: any[] = [];
  private goalSub?: Subscription;
  homeTeamName: string = '';
  awayTeamName: string = '';
  homeTeamId: number | undefined;
  awayTeamId: number | undefined;
  matchId: number | undefined;
  celebrate = false;

  constructor(
    private matchService: MatchService,
    private ngZone: NgZone,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;
    this.goalSub = this.matchService.listenForGoals().subscribe((goalData) => {
      this.ngZone.run(() => {
        console.log('But marqué :', goalData);

        const playerName$ = this.apiService.getPlayerById(goalData.playerId).pipe(
          map((playerData) => playerData.name),
          catchError(() => {
            console.error('Erreur lors de la récupération du joueur');
            return of('Inconnu');
          })
        );
        const teamName$ = this.apiService.getTeamById(goalData.teamId).pipe(
          map((teamData) => teamData.name),
          catchError(() => {
            console.error('Erreur lors de la récupération de l\'équipe');
            return of('Inconnu');
          })
        );

        forkJoin([playerName$, teamName$]).subscribe(([playerName, teamName]) => {
          goalData.joueur = playerName;
          goalData.equipe = teamName;

          this.goals.push(goalData);
          this.celebrate = true;
          setTimeout(() => {
            this.celebrate = false;
          }, 5000);
        });
      });
    });

    this.fetchMatchInfo();
  }

  fetchMatchInfo(): void {
    this.apiService.getMatchById(this.matchId).subscribe((matchData) => {
      this.homeTeamId = matchData.home_team_id;
      this.awayTeamId = matchData.away_team_id;

      const homeTeam$ = this.apiService.getTeamById(this.homeTeamId).pipe(
        map((teamData) => teamData.name),
        catchError(() => {
          console.error('Erreur lors de la récupération de l\'équipe à domicile');
          return of('Inconnu');
        })
      );
      const awayTeam$ = this.apiService.getTeamById(this.awayTeamId).pipe(
        map((teamData) => teamData.name),
        catchError(() => {
          console.error('Erreur lors de la récupération de l\'équipe à l\'extérieur');
          return of('Inconnu');
        })
      );

      forkJoin([homeTeam$, awayTeam$]).subscribe(([homeName, awayName]) => {
        this.homeTeamName = homeName;
        this.awayTeamName = awayName;
      });
    });
  }

  ngOnDestroy(): void {
    this.goalSub?.unsubscribe();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../models/match';

interface Team {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players`);
  }

  getPlayerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/players/${id}`);
  }

  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matches`);
  }

  getMatchById(matchId: number | undefined): Observable<Match> {
    return this.http.get<any>(`${this.baseUrl}/matches/${matchId}`);
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/teams`);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/teams/${id}`);
  }

  getPlayersByTeam(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/players/team/${teamId}`);
  }

  getMatchesByTeam(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/matches/team/${teamId}`);
  }

  publishGoal(goalData: { matchId: number, team: string, playerId: string }) {
    console.log('publishGoal called with:', goalData);
    return this.http.post(`${this.baseUrl}/matches/goal/${goalData.matchId}`, goalData);
  }

  getOdds(matchId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/odds/${matchId}`);
  }

  createBet(bet: {
    matchId: number;
    betType: 'home_win' | 'draw' | 'away_win';
    amount: number;
  }) {
    return this.http.post(`${this.baseUrl}/bets`, bet);
  }

  getUserBets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bets`);
  }

  updateMatch(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/matches/${id}`, data);
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TeamDetailsComponent } from './team-detail/team-detail.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { AdminComponent } from './admin/admin.component';
import { MatchDirectComponent } from './match-direct/match-direct.component';
import { SelectMatchComponent } from './select-match/select-match.component';
import {MatchOddsComponent} from './match-odds/match-odds.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'teams', component: TeamsComponent },
    { path: 'teams/:id', component: TeamDetailsComponent },
    { path: 'players/:id', component: PlayerDetailsComponent },
    { path: 'players', component: PlayersComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'match/direct/:id', component: MatchDirectComponent },
    { path: 'match/direct', component: SelectMatchComponent },
    { path: 'odds', component: MatchOddsComponent },
    { path: 'bets', loadComponent: () => import('./bets/bets.component').then(m => m.BetsComponent) },
    { path: 'bets/:id', loadComponent: () => import('./bet/bet.component').then(m => m.BetComponent) }
];

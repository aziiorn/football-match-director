export interface Match {
    id: number;
    date: string;
    home_team_id: number;
    away_team_id: number;
    homeTeamScore: number;
    awayTeamScore: number;
    homeTeamName?: string;
    awayTeamName?: string;
}
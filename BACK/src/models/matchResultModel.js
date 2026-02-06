class MatchResult {
    constructor(opponent, date, homeTeamScore, awayTeamScore, result) {
        this.opponent = opponent;
        this.date = date;
        this.homeTeamScore = homeTeamScore;
        this.awayTeamScore = awayTeamScore;
        this.result = result;
    }
}

module.exports = MatchResult
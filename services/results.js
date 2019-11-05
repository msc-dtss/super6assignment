const getGameResults = async () => {
    return JSON.parse("{ \"match1\" : {\"_id\" : \"01\",\"games_id\" : \"match1\",\"winTeam\" : \"Japan\", \"teamAScore\" : \"30\",\"teamBScore\" : \"10\",\"teamATries\" : \"4\",\"teamBTries\" : \"1\",\"firstTryTime\" : \"4\", \"userPoints\": 8}}");
}

module.exports = {
    getGameResults
};
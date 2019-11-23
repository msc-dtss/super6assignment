- Use the play/bets page in order to allow the user to edit their bet.
    - send the request to the server as follows play/bets/"betId" (search query)
    - delete the current bet and replace with the new one.
    - Needs from DB:
        {
            Most Recent Bet,
            Matching Game information,
        }
    - Delete old bet & replace with new bet functionality.

- User Id Page:
    - Display the most recent game the user has betted on:
        - Try to reuse the partials & CSS from the bets page slightly modified.
    - If the date is < the round start date:
        - Show the edit bet button (Takes the user to the play/bets page).
    - Show full bet history link at the bottom.
    
<div class="bet_table">
    <!-- Loop through the games to place into rows -->
    <% for (let index = 0; index < response.games.length; index++) { %>
        <div class="game_item game_index_<%=index%>">
            <% let currentGameId = response.games[index]._id; %>
            <!-- Loop through the gameBets, grabs the id and matches it to the currentGameId. -->
            <% for (let k = 0; k < response.bets[0].gameBets.length; k++) { %>
                <% if (response.bets[0].gameBets[k].id === currentGameId){ %>
                    <% var currentGameBetIndex = k; %> <!-- TODO Try and not use var here -->
                    <% }; %>
                <% }; %>
                    <div><%= response.games[index].teamA.name %> : 
                        <div class="bets_text"><%= response.bets[0].gameBets[currentGameBetIndex].teamATries %></div>
                    </div>
                    <div><%= response.games[index].teamB.name %> :
                        <div class="bets_text"><%= response.bets[0].gameBets[currentGameBetIndex].teamBTries %></div>
                    </div>
                    <div>Win guess:
                        <div class="bets_text"><%= response.bets[0].gameBets[currentGameBetIndex].winTeam %></div>
                    </div>
                    <div> Points:
                        <% if (response.todaysDate > response.games[index].gameDate) { %>
                            <div><%=response.bets[0].gameBets[currentGameBetIndex].points%></div>
                        <% } else { %>
                            <div>No result yet</div>
                            <% }; %>
                    </div>
        </div>
    <% } %> <!-- End of the game loops -->
</div>
<b>MongoDB Collection Info</b>

Hopefully you guys can now utilise the collection structure - but if I've missed anything, please let me know.
I've added a few notes on what we've got so far:

<b>users:-</b> Populated with 1 basic sample user, just for reference.<br>
<b>rounds:-</b> very basic, 3 rounds which can be used to link to games, bets and results<br>
<b>bets:-</b> currently empty, but gives an idea of the collection structure, linking to users by id<br>
<b>games:-</b> populated with all the group fixtures<br>
<b>matchResults:-</b> to store the details of the match outcome, linked by game_id.  This could prbbaly be nested within 'games'
not sure it needs to be seperate.<br>
<b>points:-</b> used for calculating the scores, and position of the user in the 'league' table, if we decide to go down that route.
Again, maybe this could be nested with users, or 'games'.<br><p>

for each collection, Initially I've chosen to set our own ID, rather than using the system generated 'guid' style ID - I'm not sure if this makes any real difference other than making them easy to refer to in the business logic, if we even need to refer to particular/specifc id's in code

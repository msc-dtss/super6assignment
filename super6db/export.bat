@echo off

SET DIR=%~dp0
cd %DIR%

rem Need to ensure this actually works on Windows.
pushd %DIR%/..
mongodump -d super6db -o %CD%
# Also export in json as a readable reference
mongoexport -d super6db -c bets -o "%DIR%/bets.json"
mongoexport -d super6db -c games -o "%DIR%/games.json"
mongoexport -d super6db -c rounds -o "%DIR%/rounds.json"
mongoexport -d super6db -c users -o "%DIR%/users.json"
popd

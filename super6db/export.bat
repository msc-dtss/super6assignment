@echo off

SET DIR=%~dp0
cd %DIR%

rem Need to ensure this actually works on Windows.
pushd %DIR%/..
rem Export in json as a readable reference
mongoexport -d super6db -c bets -o "%DIR%/bets.json" --pretty --jsonArray
mongoexport -d super6db -c games -o "%DIR%/games.json" --pretty --jsonArray
mongoexport -d super6db -c rounds -o "%DIR%/rounds.json" --pretty --jsonArray
mongoexport -d super6db -c users -o "%DIR%/users.json" --pretty --jsonArray
popd

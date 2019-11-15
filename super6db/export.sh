#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

# Export in json as a readable reference
mongoexport -d super6db -c bets -o "${DIR}/bets.json" --pretty --jsonArray
mongoexport -d super6db -c games -o "${DIR}/games.json" --pretty --jsonArray
mongoexport -d super6db -c rounds -o "${DIR}/rounds.json" --pretty --jsonArray
mongoexport -d super6db -c users -o "${DIR}/users.json" --pretty --jsonArray
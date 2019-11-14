#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

mongodump -d super6db -o "${DIR}/.."

# Also export in json as a readable reference
mongoexport -d super6db -c bets -o "${DIR}/bets.json"
mongoexport -d super6db -c games -o "${DIR}/games.json"
mongoexport -d super6db -c rounds -o "${DIR}/rounds.json"
mongoexport -d super6db -c users -o "${DIR}/users.json"
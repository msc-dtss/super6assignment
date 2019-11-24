#!/bin/bash

# See https://stackoverflow.com/a/246128/1676561
SOURCE="${BASH_SOURCE[0]}"
while [[ -h "${SOURCE}" ]]; do # resolve ${SOURCE} until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "${SOURCE}" )" && pwd )"
    SOURCE="$(readlink "${SOURCE}")"
    [[ ${SOURCE} != /* ]] && SOURCE="${DIR}/${SOURCE}" # if ${SOURCE} was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
CURRENT_DIR="$( cd -P "$( dirname "${SOURCE}" )" && pwd )"

cd "${CURRENT_DIR}"

# In case the runner didn't make a volume with the right files or volumed the json file
function ensure_config() {
    CONFIG_FILE="$1"
    if [[ ! -f "${CURRENT_DIR}/config/${CONFIG_FILE}" ]]; then
        cp "./_config/${CONFIG_FILE}" "./config/${CONFIG_FILE}"
    fi
}

# In case the runner didn't make a volume out of config
if [[ ! -d config ]]; then
    mkdir config
fi

ensure_config authorisation.json
ensure_config config.json
ensure_config points.json

service mongod start

tail -f /var/log/mongodb/* &
node ${CURRENT_DIR}/bin/www
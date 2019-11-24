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

# Echo colours
INFO="\e[1;34m"
ERROR="\e[1;31m"
SUCCESS="\e[1;32m"
END="\e[0m"

# Settings
PACKAGE_NAME="shu-ddsa-rugbysuper6"

# Option defaults
SKIP_QUESTION="false"

for i in "$@"
do
    case $i in
        -y)
            # Useful for automated builds
            SKIP_QUESTION="true"
            shift
        ;;
        *)
        ;;
    esac
done

function info() {
    MSG="$1"
    echo -e "${INFO}[INFO]${END}    ${MSG}"
}

function error() {
    MSG="$1"
    echo -e "${ERROR}[ERROR]${END}   ${MSG}"
}

function success() {
    MSG="$1"
    echo -e "${SUCCESS}[SUCCESS]${END} ${MSG}"
}

function check_dependency() {
    COMMAND="$1"
    which "${COMMAND}" > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        error "Dependency not found: ${COMMAND}"
        exit 1
    fi
}

if [[ "${SKIP_QUESTION}" != "true" ]]; then
    read -p "Is your code clean and up-to-date? [y/N]"
    if [[ "$REPLY" != "y" ]] && [[ "$REPLY" != "Y" ]]; then
        exit
    fi
fi

info "Checking dependencies..."
check_dependency rsync
check_dependency npm
check_dependency node


info "Checking for weird non breaking space character that sometimes comes from macs..."
./check_weird_space.sh
if [[ $? -ne 0 ]]; then
    error "Not building due to the code having that weird space character"
    exit 1
fi

info "Running tests..."
npm test > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
    error "Not building due to failed tests"
    exit 1
fi
success "All tests passed"

timestamp=$(date +%Y-%m-%d_%H-%M-%S)

rm -rf ${PACKAGE_NAME}
mkdir ${PACKAGE_NAME}

info "Preparing ${PACKAGE_NAME}..."
# Note: No need to exclude hidden files (i.e. starting with `.`) as `*` already excludes those
rsync -a \
--exclude=node_modules \
--exclude=super6assignment.iml \
--exclude=build.sh \
--exclude=Dockerfile \
--exclude=check_weird_space.sh \
--exclude=graph.sh \
--exclude=*.replacements \
--exclude=entrypoint.sh \
--exclude=${PACKAGE_NAME} \
--exclude=${PACKAGE_NAME}_*.zip \
* ${PACKAGE_NAME}

if [[ $? -ne 0 ]]; then
    error "Problem while copying files"
    exit 1
fi

info "Packaging ${PACKAGE_NAME}..."
zip -r ${PACKAGE_NAME}_$timestamp.zip ${PACKAGE_NAME} > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
    error "Unable to build zip package"
    exit 1
fi
success "Done"
info "Package available at ${PWD}/${PACKAGE_NAME}_$timestamp.zip"
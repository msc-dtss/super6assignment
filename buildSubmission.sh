#!/bin/bash

read -p "Is your code clean and up-to-date?"
if [ "$REPLY" != "yes" ]; then
   exit
fi

timestamp=$(date +%Y-%m-%d_%H-%M-%S)

rm -rf submission
mkdir submission
rsync -a \
--exclude=submission \
--exclude node_modules \
--exclude super6assignment.iml \
--exclude .idea \
--exclude .git \
--exclude .gitignore \
--exclude buildSubmission.sh \
* submission
zip -r submission_$timestamp.zip submission

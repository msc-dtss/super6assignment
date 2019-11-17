#!/bin/bash

grep -r ' ' --exclude-dir=node_modules --exclude-dir=.git -I --exclude=check_weird_space.sh > /dev/null
if [[ $? -eq 0 ]];then
    echo "Weird space character found in the code!"
    grep -r ' ' --exclude-dir=node_modules --exclude-dir=.git -I --exclude=check_weird_space.sh
    exit 1
fi
exit 0
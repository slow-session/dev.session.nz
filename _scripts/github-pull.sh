#!/bin/sh
#
# You may need to change ARCHIVEDIR and/or SOURCEDIR variables
# to match your directory structure 
#

SOURCEDIR="${HOME}/GitHub/${1}"

echo ${SOURCEDIR}
exit
#
# Get any updates from main respository
#
cd ${SOURCEDIR}
git pull

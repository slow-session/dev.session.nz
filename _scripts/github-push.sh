#!/bin/sh
#
# You may need to change ARCHIVEDIR and/or SOURCEDIR variables
# to match your directory structure 
#
SOURCEDIR="${HOME}/GitHub/${1}"

#
# Push the changes to the main site
# They'll get loaded next time there's an upgrade
#
git add .
git commit -m "Updating system files"
git push

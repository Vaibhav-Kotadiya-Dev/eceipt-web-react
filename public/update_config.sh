#!/bin/bash
source /usr/local/config/production.config
sed -i -e "s|#SCHEDULER_BASE_URL|$SCHEDULER_BASE_URL|g" index.html
sed -i -e "s|#NOTIFICATION_URL|$NOTIFICATION_URL|g" index.html
sed -i -e "s|#AAS_URL|$AAS_URL|g" index.html
sed -i -e "s|#BE_URL|$BE_URL|g" index.html

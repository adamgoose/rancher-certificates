#!/bin/bash

curl -H "Content-Type: application/json" \
    -H 'Accept: application/json' \
    --user $RANCHER_ACCESS_KEY:$RANCHER_SECRET_KEY \
    $RANCHER_ENDPOINT

#!/bin/bash

curl -H "Content-Type: application/json" \
    -H 'Accept: application/json' \
    --user $CATTLE_ACCESS_KEY:$CATTLE_SECRET_KEY \
    $CATTLE_URL

bin/sslizer deploy_cert lc.delivvr.io ../certs/lc.delivvr.io/privkey.pem ../certs/lc.delivvr.io/cert.pem ../certs/lc.delivvr.io/fullchain.pem

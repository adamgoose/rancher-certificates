#!/bin/bash

curl -H "Content-Type: application/json" \
    -H 'Accept: application/json' \
    --user $RANCHER_ACCESS_KEY:$RANCHER_SECRET_KEY \
    $RANCHER_ENDPOINT

bin/sslizer deploy_cert lc.delivvr.io ../certs/lc.delivvr.io/privkey.pem ../certs/lc.delivvr.io/cert.pem ../certs/lc.delivvr.io/chain.pem

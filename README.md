# LetsEncrypt for Rancher

This container provides a convenient and easy way to manage SSL (https://) Certificate Issuing and Deployment using [LetsEncrypt](https://letsencrypt.org/). Upon Issuing an SSL Certificate, the certificate will automatically be added to your [Rancher](http://rancher.com) Environment. If you manually renew your cert (automatic renewals not yet supported), the old Rancher cert will be updated to the new one. To top it off, we'll automatically redirect all requests to this container to https://. Thus, your web server container can simply be configured to receive requests on port 80 without ssl, and we'll take care of the rest!

## Installation

First, let's get a container running. Simply use the `adamgoose/sslizer:latest` image when creating your new container inside Rancher, and expose port 80 to your host.

    docker run -itd -p 80:80 adamgoose/sslizer

If you would like to persist your certificates to your host, you can mount the `/root/certs` directory.

    docker run -itd -p 80:80 -v /path/on/host:/root/certs adamgoose/sslizer

> You can also mount the /root/domains.txt file if you'd like to control the list of domains from the host.

You'll frequently need to execute a bash terminal inside the container. In order to execute bash inside a container, execute `bash ps` to find the container ID (first column). Then, try this:

    docker exec -it ${CONTAINER_ID} /bin/bash

You'll need to configure the container with a Rancher API Key if you would like it to automatically update certificates inside Rancher itself. Set the following environment variables by creating an API Key in the API tab of Rancher:

    docker run -itd -p 80:80 \
        -e RANCHER_ENDPOINT="" \ ## Please make sure to get this URL from the API Tab (I need the projects/{id} portion)!
        -e RANCHER_ACCESS_KEY="" \
        -e RANCHER_SECRET_KEY="" \
        adamgoose/sslizer

## Usage

Enter a bash session on your running sslizer container (see above), and use `vim /root/domains.txt` to edit the list of domains (one per line) you'd like to issue certificates for.

> LetsEncrypt has a rate limit of 5 certificates per week, so start with just a couple.

Finally, execute LetsEncrypt with the following command.

    sh /root/letsencrypt.sh -c

If everything works smoothly, your certificates should be valid, and installed to Rancher!

** Total work in progress... Have a look, but don't even try it! **

# LetsEncrypt for Rancher

This container provides a convenient and easy way to manage SSL (https://) Certificate Issuing and Deployment using [LetsEncrypt](https://letsencrypt.org/). Upon Issuing an SSL Certificate, the certificate will automatically be added to your [Rancher](http://rancher.com) Environment. If you manually renew your cert (automatic renewals not yet supported), the old Rancher cert will be updated to the new one. To top it off, we'll automatically redirect all requests to this container to https://. Thus, your web server container can simply be configured to receive requests on port 80 without ssl, and we'll take care of the rest!

## Installation

First, let's get a container running. Simply use the `adamgoose/sslizer` image when creating your new container inside Rancher, and expose port 80 to your host.

    docker run -itd -p 80:80 adamgoose/sslizer

If you would like to persist your certificates to your host, you can mount the `/var/lib/certs` directory.

    docker run -itd -p 80:80 -v /path/on/host:/var/lib/certs adamgoose/sslizer

> You can also mount the /var/lib/domains.txt file if you'd like to control the list of domains from the host.

You'll frequently need to Execute a Shell inside the container. You can do this from the Rancher UI, or SSH on to the host, execute `bash ps` to find the container ID (first column). Then, try this:

    docker exec -it ${CONTAINER_ID} /bin/bash

You'll need to configure the container with a Rancher API Key if you would like it to automatically update certificates inside Rancher itself. Set the following label when creating your container:

    docker run -itd -p 80:80 \
        -l io.rancher.container.create_agent=true
        -l io.rancher.container.agent.role=environment
        adamgoose/sslizer

## Usage

Enter a bash session on your running sslizer container (see above), and use `vim /var/lib/domains.txt` to edit the list of domains (one per line) you'd like to issue certificates for.

> LetsEncrypt has a rate limit of 5 certificates per week, so start with just a couple.

Next, create a "Load Balancer" service in Rancher. Listen on port 80 for now. We'll need to have one certificate in Rancher before we can configure our Load Balancer to listen on https.

Click "Show advanced routing options", and add your domains, listening on port 80 pointing to port 80 on your sslizer. For DNS reasons, it's wise to schedule your load balancer to always exist on a particular host. Do so under the "Scheduling" tab.

Execute a shell into the container, and run LetsEncrypt with the following command.

    letsencrypt -c

If everything works smoothly, your certificates should be valid, and installed to Rancher!    

Finally, you'll need to "Clone" your existing Load Balancer to add the https listener. Add a port listener on 443, check the "SSL" box, then select your certificate from the dropdown below. Just trash the old service, and start the new one!

## LetsEncrypt Implementation Information

This container uses an incredibly simple-to-use bash script, provided by [lukas2511/letsencrypt.sh](https://github.com/lukas2511/letsencrypt.sh). If you are not able to use Rancher, or even Docker, consider this bash script a highly-recommended simplification of the entire certificate process.

We have configured this bash script (`/etc/letsencrypt.sh/config.sh`) to call our CLI tool (NodeJS) as a "hook", which uploads the provided certificate to Rancher. To learn more about this CLI, try `sslizer --help`.

When invoking the `sslizer` command, LetsEncrypt provides the following CLI arguments:

    sslizer deploy_cert {your_domain.com} {path to privkey} {path to cert} {path to fullchain}

The "fullchain" file provided includes the certificate *and* the chain certificate. Rancher expects the certificate and chain to be separated into two different fields. Thus, when `sslizer deploy_cert` is invoked, we remove the string `full` from the last provided path. This provides us with the "chain" only, albeit wonky.

## Roadmap

- [x] Use LetsEncrypt default paths.
- [ ] Automatically add certificate to Load Balancer service
- [ ] Automatic renewals
- [ ] Support for dns-01 challenge type

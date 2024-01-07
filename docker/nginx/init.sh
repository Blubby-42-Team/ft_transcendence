#!/bin/bash
apk add openssl

# Generate self-signed certificate
mkdir -p /etc/nginx/ssl && openssl req -x509 \
	-sha256 -days 356 \
	-nodes \
	-newkey rsa:2048 \
	-subj "/CN=localhost/C=FR/L=Brussels/O=blubby@42" \
	-keyout /etc/nginx/ssl/inception.key -out /etc/nginx/ssl/inception.crt

# Run nginx
nginx -g "daemon off;"
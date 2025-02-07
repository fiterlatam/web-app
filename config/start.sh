#!/bin/sh

envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

sed -i 's/__URI__/$uri/g' /etc/nginx/conf.d/default.conf

exec "$@"

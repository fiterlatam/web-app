#!/bin/bash
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js
exec "$@"
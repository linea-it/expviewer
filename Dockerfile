FROM node:8.10 as builder

COPY . /src/app
WORKDIR /src/app

RUN yarn -v
RUN yarn --ignore-optional


RUN yarn run build
FROM nginx:latest

# Make /var/cache/nginx/ writable by non-root users
RUN chgrp nginx /var/cache/nginx/
RUN chmod -R g+w /var/cache/nginx/

# Write the PID file to a location where regular users have write access.
RUN sed --regexp-extended --in-place=.bak 's%^pid\s+/var/run/nginx.pid;%pid /var/tmp/nginx.pid;%' /etc/nginx/nginx.conf

COPY --from=builder /src/app/build /var/www/expviewer
RUN chgrp nginx /var/www/expviewer
RUN chmod -R g+w /var/www/expviewer

USER nginx

COPY nginx-proxy.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/expviewer

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

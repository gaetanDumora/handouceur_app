FROM nginx:latest

COPY ./infra/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 443
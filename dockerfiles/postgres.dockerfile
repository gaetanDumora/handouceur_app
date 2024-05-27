FROM postgres:latest

COPY ./infra/postgres/init.sql /docker-entrypoint-initdb.d/
COPY ./infra/postgres/postgresql.conf /etc/postgresql/postgresql.conf

RUN chown postgres:postgres /etc/postgresql/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
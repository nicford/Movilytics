FROM postgres:alpine

EXPOSE 5432

# just for testing now, use more secure way later


COPY ./pgdata /var/lib/postgresql/data

COPY ./schema_init.sql /docker-entrypoint-initdb.d/1_init.sql

COPY ./data_init.sql /docker-entrypoint-initdb.d/2_data_init.sql
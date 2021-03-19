FROM postgres:latest

EXPOSE 5432

# just for testing now, use more secure way later
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=dev_postgres
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432

COPY ./pgdata /var/lib/postgresql/data

COPY ./schema_init.sql /docker-entrypoint-initdb.d/1_init.sql

COPY ./data_init.sql /docker-entrypoint-initdb.d/2_data_init.sql
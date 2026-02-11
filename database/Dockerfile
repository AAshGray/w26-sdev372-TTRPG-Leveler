# Use official MySQL image
FROM mysql:8.4

# set environment variables from 
ENV MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${DB_NAME}
ENV MYSQL_USER=${DB_USER}
ENV MYSQL_PASSWORD=${DB_PASSWORD}

EXPOSE 3306

# https://docs.docker.com/guides/pre-seeding/
COPY ./init.sql /docker-entrypoint-initdb.d/
COPY ./seed.sql /docker-entrypoint-initdb.d/
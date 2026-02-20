# Use official MySQL image
FROM mysql:8.4

# https://docs.docker.com/guides/pre-seeding/
COPY ./init_and_seed.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
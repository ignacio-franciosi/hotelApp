FROM mysql:latest

ADD ./init.sql /docker-entrypoint-initdb.d 

# Establecer la variable de entorno para el puerto
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=hotelapp
ENV MYSQL_PORT=3306
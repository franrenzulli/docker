# Usa la imagen oficial de Nginx en su versión más ligera (Alpine Linux)
FROM nginx:alpine

# Copia todos los archivos de tu carpeta local (donde está el Dockerfile)
# al directorio donde Nginx busca los archivos web (/usr/share/nginx/html)
COPY . /usr/share/nginx/html

# Expone el puerto 80 del contenedor, que es el puerto por defecto de Nginx
EXPOSE 80

# El comando por defecto para iniciar Nginx en primer plano
# Esto es importante para que el contenedor no se detenga inmediatamente
CMD ["nginx", "-g", "daemon off;"]
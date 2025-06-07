# Usa una imagen base oficial de Node.js (versión 20, Alpine para ser ligera)
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json para instalar las dependencias
# Se hace esto antes de copiar el resto del código para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación Node.js escuchará
EXPOSE 3000

# Define el comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["npm", "start"]
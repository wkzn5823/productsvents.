FROM node:20

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto 8000
EXPOSE 8000

# Comando para iniciar el servidor
CMD ["npm", "start"]

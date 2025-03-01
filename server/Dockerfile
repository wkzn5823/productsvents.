# Usa la imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de backend al contenedor
COPY package.json ./
COPY package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .  

# Expone el puerto 5000
EXPOSE 5000

# Comando para iniciar el backend
CMD ["npm", "run", "dev"]
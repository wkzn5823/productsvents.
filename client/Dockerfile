# Usa Node.js como base
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente del frontend
COPY . .  

# Exponer el puerto 3000
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "dev", "--", "--host"]
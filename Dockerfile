#Se define la imagen base
FROM node

#Despues creamos una carpeta donde guardaremos nuestro proyecto
WORKDIR /app

#Con esto copiamos el package.json de nuestra carpeta actual, a la carpeta dockeroperations
COPY package*.json ./

#Una vez copiado, procedemos a ejecutar npm install interno en esa carpeta (dockeroperation)
RUN npm install

#Despues de la instalacion , procedemos a tomar el codigo del aplicativo
COPY . .

#Exponemos un puerto para que este escuche a partir de un puerto de nuestra computadora
EXPOSE 8080

#Una vez realizado, se debera ejecutar "npm start" para iniciar la aplicacion
CMD ["npm" , "start"]

# [![1-removebg-preview-1.png](https://i.postimg.cc/7hRNDtbd/1-removebg-preview-1.png)](https://postimg.cc/WqMZwnGw) SAE Systems

## Configuración Inicial

### Instalando dependencias

Para instalar todas las dependencias necesarias

```bash
//En la carpeta raiz

npm run install:all
```
> En caso de problemas con la instalación de paquetes verificar el final de este documento

Para iniciar los servidores de backend y frontend

```bash
npm run dev
```
> El localhost de backend es el puerto 3000 y el de frontend es el puerto 4200

### Usando Docker

Para iniciar el proyecto con Docker (Sin usar dependencias)
```bash
//En la carpeta raiz

docker-compose build
docker.compose up
```
> Este es un metodo alternativo y más directo
> El localhost de backend es el puerto 3000 y el de frontend es el puerto 4200

## Instrucciones Completas de la Web

[![image.png](https://i.postimg.cc/bvP9ztNy/image.png)](https://postimg.cc/4Y89Pn9q)

Al acceder lo primero que te recibe es la pantalla de inicio, la cual dispone de 3 opciones:
- **Ver Instrucciones**
- **Empleados**
- **Departamentos**

## Ver Instrucciones

[![image.png](https://i.postimg.cc/zvv90Q9c/image.png)](https://postimg.cc/rR6npfy1)

Al hacer click en el boton de Ver Instrucciones se desplegara una ventana modal la cual permite ver unas instrucciones básicas de las funcionalidades de la web sin profundizar demasiado, en este caso, explica los iconos de cada apartado

## Empleados

[![image.png](https://i.postimg.cc/bJ370PFn/image.png)](https://postimg.cc/TL5NGzx2)

Al hacer click en el apartado de empleado se carga una vista como la de arriba, en la cual se ven listados todos los empleados de la empresa, algo de su información y sus botones de acción, ademas del de añadir nuevo.

### Crear/Editar Empleado

[![image.png](https://i.postimg.cc/fyP1FKsT/image.png)](https://postimg.cc/WqM9q0tQ)

Al hacer click en el boton de añadir nuevo o en el de editar de cada empleado, se desplegara una ventana modal como la de arriba, donde la unica diferencia salvo el titulo o el contenido del boton, sera que al ser editar se precargaran los valores del empleado seleccionado.

### Información de Empleado

[![image.png](https://i.postimg.cc/jjTmG2pN/image.png)](https://postimg.cc/K190TGvv)

Al hacer click en el boton de info despliega una ventana modal con una carta con la información del empleado seleccionado.

## Departamentos
[![image.png](https://i.postimg.cc/0jKV6qgP/image.png)](https://postimg.cc/5Q1BGTNR)

Al hacer click en el apartado de departamento se carga una vista como la de arriba, en la cual se ven listados todos los departamenos de la empresa, algo de su información y sus botones de acción, ademas del de añadir nuevo.

### Crear/Editar Departamento

[![image.png](https://i.postimg.cc/bYKhmyw0/image.png)](https://postimg.cc/Z0F2Rh30)

Al hacer click en el boton de añadir nuevo o en el de editar de cada departamento, se desplegara una ventana modal como la de arriba, donde la unica diferencia salvo el titulo o el contenido del boton, sera que al ser editar se precargaran los valores del departamento seleccionado.

### Información de Departamento

[![image.png](https://i.postimg.cc/sgzRRTSv/image.png)](https://postimg.cc/w7wrXcwp)

Al hacer click en el boton de info despliega una ventana modal con una carta con la información del departamento seleccionado, y su enlace de Ver Jerarquia de Miembros para visualizar el grafico.

### Eliminar Departamento

[![image.png](https://i.postimg.cc/DZZjTXBW/image.png)](https://postimg.cc/B8rc5XWs)

Al hacer click en el boton de eliminar se despliega una ventana modal como la de arriba para confirmar si se desea eliminar y evitar borrados accidentales.

### Añadir Miembro
[![image.png](https://i.postimg.cc/dV9cQGmn/image.png)](https://postimg.cc/4YnSB70h)

Al hacer click en el boton de añadir miembros se despliega una ventana modal como la de arriba, la cual tiene 2 dropdown, el primero para seleccionar el empleado que añadir al departamento (en el solo estan disponibles los empleados de la empresa que no han sido asignados ya al departamento) y el segundo es opcional, de superiores (en el cual se puede elegir entre los empleados que ya estan en el departamento)

## Problemas con la configuración Inicial

En caso de no funcionar al hacer el npm run install:all, se recomienda instalar cada modulo de forma manual, para lo cual se listan a continuación
```bash
//En la carpeta raiz

npm i concurrently
cd api
npm i cors
npm i dotenv
npm i express-validator
npm i express
npm i mongoose
npm i -D @types/cors
npm i -D @types/express
npm i -D @types/node
npm i -D nodemon
npm i -D ts-node
npm i -D typescript
cd..
cd web
npm i @angular-devkit/build-angular
npm i @angular/animations
npm i @angular/cdk
npm i @angular/cli
npm i @angular/common
npm i @angular/compiler-cli
npm i @angular/compiler
npm i @angular/core
npm i @angular/forms
npm i @angular/platform-browser-dynamic
npm i @angular/platform-browser
npm i @angular/router
npm i @popperjs/core
npm i @swimlane/ngx-graph --legacy-peer-deps
npm i bootstrap-icons
npm i bootstrap
npm i d3 --legacy-peer-deps
npm i dagre --legacy-peer-deps
npm i jquery
npm i popper.js
npm i rxjs
npm i tslib
npm i zone.js --legacy-peer-deps
npm i -D @types/bootstrap
npm i -D @types/d3-dispatch --legacy-peer-deps
npm i -D @types/d3-drag --legacy-peer-deps
npm i -D @types/d3-shape --legacy-peer-deps
npm i -D @types/d3-timer --legacy-peer-deps
npm i -D @types/dagre --legacy-peer-deps
npm i -D @types/jasmine
npm i -D @types/jquery
npm i -D @types/popper.js
npm i -D jasmine-core
npm i -D karma-chrome-launcher
npm i -D karma-coverage
npm i -D karma-jasmine-html-reporter
npm i -D karma-jasmine
npm i -D karma
npm i -D typescript

//Ya no deberia dar problemas al correr el servidor
```
*Este proyecto fue hecho como parte de la prueba técnica de Aether Solutions*

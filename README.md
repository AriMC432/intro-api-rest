# 🚀 IoT Manager - CRUD con MockAPI

IoT Manager es una aplicación web desarrollada en JavaScript vainilla que implementa un sistema CRUD (Create, Read, Update, Delete) sobre una API REST creada en MockAPI. El proyecto simula el control y gestión de dispositivos IoT mediante comandos específicos que permiten actualizar su dirección de movimiento.

La aplicación fue diseñada con una interfaz moderna tipo Engineer Dark UI, utilizando Bootstrap 5 y estilos personalizados para ofrecer una experiencia profesional, estructurada y visualmente atractiva.

## 🌐 API utilizada

Endpoint:

https://698a18b7c04d974bc6a1598e.mockapi.io/api/v1/dispositivos_IoT

### Estructura del recurso

- id (Object ID)
- deviceName (String)
- ipclient (String - formato IPv4)
- direccionCode (Number)
- direccionText (String)
- DateTime (ISO Date)

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- Bootstrap 5
- JavaScript Vainilla
- Fetch API
- Async/Await
- MockAPI (REST API)

## ⚙️ Funcionalidades

- Listar dispositivos almacenados en la API
- Crear nuevos registros
- Editar dispositivos existentes
- Eliminar registros
- Búsqueda dinámica por nombre, IP o dirección
- Panel de comandos rápidos (1–9)
- Validación básica de formato IP
- Notificaciones tipo Toast
- Interfaz profesional tipo dashboard técnico

## 🎮 Comandos implementados

1 - Adelante  
2 - Detener  
3 - Atrás  
4 - Vuelta derecha adelante  
5 - Vuelta izquierda adelante  
6 - Vuelta derecha atrás  
7 - Vuelta izquierda atrás  
8 - Giro 90° derecha  
9 - Giro 90° izquierda  

Estos comandos cargan automáticamente los campos direccionCode y direccionText en el formulario.

## 📂 Estructura del proyecto

crud-iot/

- index.html  
- styles.css  
- app.js  
- README.md  

El proyecto mantiene separación clara de responsabilidades entre estructura (HTML), estilos (CSS) y lógica (JavaScript).

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:
   git clone URL_DEL_REPOSITORIO

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Instalar la extensión Live Server.

4. Ejecutar index.html con "Open with Live Server".

La aplicación se ejecutará en:
http://127.0.0.1:5500

## 📡 Métodos HTTP utilizados

- GET → Obtener dispositivos
- POST → Crear dispositivo
- PUT → Actualizar dispositivo
- DELETE → Eliminar dispositivo

## 🎯 Objetivo del proyecto

Aplicar conceptos fundamentales de desarrollo web y consumo de APIs REST utilizando JavaScript moderno (async/await), manipulación del DOM y separación de archivos, simulando un entorno de control IoT bajo un enfoque profesional.

## 👩‍💻 Autor

Ariana Muñoz Castillo  
Ingeniería en Sistemas Computacionales

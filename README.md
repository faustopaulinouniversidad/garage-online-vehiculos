# 🚗 GarageOnline – Ecommerce de Vehículos

GarageOnline es una aplicación web de ecommerce enfocada en la **venta de vehículos**.  
Está desarrollada con **HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 y Font Awesome**, consumiendo dinámicamente un archivo **JSON remoto** con el catálogo de vehículos.

El usuario puede:

- Buscar vehículos por **marca, modelo o categoría**
- Ver el **detalle** de cada vehículo en una ventana modal
- Añadir vehículos al **carrito de compras**
- Simular un **proceso de pago**
- Generar y descargar una **factura en PDF** con jsPDF

---

## 📋 Tabla de Contenidos

1. [Demo / Enlace en vivo](#-demo--enlace-en-vivo)
2. [Características principales](#-características-principales)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
5. [Requisitos previos](#-requisitos-previos)
6. [Instalación y ejecución local](#-instalación-y-ejecución-local)
7. [Uso de la aplicación](#-uso-de-la-aplicación)
8. [Accesibilidad, SEO y buenas prácticas](#-accesibilidad-seo-y-buenas-prácticas)
9. [Estructura de archivos](#-estructura-de-archivos)
10. [Fuente de datos (JSON)](#-fuente-de-datos-json)
11. [Roadmap / Mejoras futuras](#-roadmap--mejoras-futuras)
12. [Contribuciones](#-contribuciones)
13. [Licencia](#-licencia)
14. [Autor](#-autor)

---

## 🌐 Demo / Enlace en vivo

> 💡 **Opcional**: cuando lo publiques, reemplaza estos enlaces.

- **GitHub Pages:**  
  `https://TU_USUARIO.github.io/garageonline-vehiculos/`
- **Vercel:**  
  `https://garageonline-vehiculos.vercel.app/`

---

## ✨ Características principales

- 🧱 **Frontend 100% estático** con HTML5, CSS3 y JavaScript puro (ES6+).
- 🎨 Diseño **responsive** usando **Bootstrap 5**.
- 🧭 Navegación semántica con `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- 🔍 **Buscador dinámico** por marca, modelo y categoría.
- 🚘 Tarjetas de vehículos generadas dinámicamente a partir de un **JSON remoto**.
- 🖼 Modal de **detalle de vehículo** con imagen ampliada y datos estructurados.
- 🛒 **Carrito de compras** con:
  - Selección de cantidad
  - Subtotales por ítem
  - Total del carrito
  - Persistencia en `localStorage`
- 💳 Modal de **pago simulado** (nombre, tarjeta, etc.).
- 📄 Generación de **factura en PDF** con detalle de la compra usando **jsPDF**.
- ♿ Enfoque en **accesibilidad (A11y)**, roles ARIA y estructura semántica.
- 🔐 Diseño listo para aprovechar sitios servidos por **HTTPS**.

---

## 🛠 Tecnologías utilizadas

- **HTML5** – estructura semántica de la página.
- **CSS3** – estilos personalizados (variables, animaciones, responsive).
- **Bootstrap 5.3.x (CDN)** – grid, layout y componentes (navbar, cards, modals, spinner).
- **Font Awesome 6.x (CDN)** – iconos (coche, carrito, etc.).
- **JavaScript ES6+** – lógica de negocio y manipulación del DOM.
- **Fetch API** – consumo de datos desde archivo JSON remoto.
- **jsPDF** – generación de factura en PDF en el navegador.
- **localStorage** – persistencia del carrito en el navegador.

---

## 🧱 Arquitectura del proyecto

La aplicación está dividida en **tres archivos principales**:

- `index.html` – estructura semántica, secciones, navbar, modales.
- `style.css` – estilos personalizados para tarjetas, navbar, animaciones, etc.
- `script.js` – lógica de la aplicación (carga JSON, filtro, carrito, PDF).

No se utiliza ningún framework de frontend (React, Vue, etc.);  
toda la lógica se implementa con **JavaScript nativo**.

---

## ✅ Requisitos previos

Para ejecutar el proyecto en local solo necesitas:

- Un navegador moderno (Chrome, Firefox, Edge, Safari).
- (Recomendado) [Visual Studio Code](https://code.visualstudio.com/)
- (Opcional pero útil) Extensión **Live Server** para VS Code.

No se requiere backend ni base de datos;  
el catálogo se consume desde un JSON público.

---

## 💻 Instalación y ejecución local

1. **Clonar o descargar el repositorio**

```bash
# Clonar
git clone https://github.com/TU_USUARIO/garageonline-vehiculos.git

# O descargar ZIP desde GitHub

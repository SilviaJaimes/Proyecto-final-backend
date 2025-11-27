# 📚 Sistema de Tutorías Virtuales

## 📋 Descripción del Proyecto

Sistema web completo para gestión de tutorías virtuales que conecta estudiantes con tutores. Permite a los estudiantes buscar tutores por materias, solicitar tutorías en horarios disponibles, y gestionar sus sesiones. Los tutores pueden crear horarios, aceptar/rechazar solicitudes, y registrar resúmenes de las tutorías completadas.

### 🎯 Características Principales

**Para Estudiantes:**
- Registro e inicio de sesión
- Búsqueda de tutores por nombre o materia
- Ver horarios disponibles de tutores
- Solicitar tutorías
- Ver tutorías activas (pendientes y aceptadas)
- Historial completo de tutorías
- Cancelar tutorías pendientes

**Para Tutores:**
- Registro e inicio de sesión
- Crear y gestionar horarios de disponibilidad
- Ver solicitudes de tutorías pendientes
- Aceptar o rechazar solicitudes
- Registrar resumen de tutorías completadas
- Gestionar perfil (materias, especialidad, descripción)
- Ver historial y estadísticas

### 🛠️ Tecnologías Utilizadas

**Backend:**
- Node.js + Express
- Sequelize ORM
- MySQL
- JWT (autenticación)
- bcrypt (encriptación)

**Frontend:**
- React + Vite
- React Router DOM
- Tailwind CSS
- SweetAlert2
- Axios

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:4000/api
```

---

## 🔐 Autenticación

### 1. Registro de Usuario (Estudiante)

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "nombre": "Silvia Jaimes",
  "correo": "silvia@example.com",
  "password": "123456",
  "rol": "estudiante"
}
```

**Response (200 OK):**
```json
{
  "message": "Usuario registrado correctamente",
  "usuario": {
    "id": 1,
    "nombre": "Silvia Jaimes",
    "correo": "silvia@example.com",
    "rol": "estudiante"
  }
}
```

---

### 2. Registro de Usuario (Tutor)

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "nombre": "Jeanpierre Angarita",
  "correo": "jeanpierre@example.com",
  "password": "123456",
  "rol": "tutor",
  "materias": "Matemáticas, Física"
}
```

**Response (200 OK):**
```json
{
  "message": "Usuario registrado correctamente",
  "usuario": {
    "id": 2,
    "nombre": "Jeanpierre Angarita",
    "correo": "jeanpierre@example.com",
    "rol": "tutor"
  },
  "tutor": {
    "id": 1,
    "usuarioId": 2,
    "materias": "Matemáticas, Física"
  }
}
```

---

### 3. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "correo": "silvia@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Login correcto",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Silvia Jaimes",
    "correo": "silvia@example.com",
    "rol": "estudiante"
  }
}
```

**💡 Nota:** Guarda el token recibido. Deberás incluirlo en el header `Authorization: Bearer <token>` para todas las rutas protegidas.

---

## 👨‍🏫 Tutores

### 4. Listar Todos los Tutores (Público)

**Endpoint:** `GET /tutores`

**Headers:** Ninguno (ruta pública)

**Response (200 OK):**
```json
{
  "tutores": [
    {
      "id": 1,
      "materias": "Matemáticas, Física",
      "especialidad": "Cálculo diferencial",
      "descripcion": "Tutor con 5 años de experiencia",
      "usuario": {
        "id": 2,
        "nombre": "Jeanpierre Angarita",
        "correo": "jeanpierre@example.com"
      }
    }
  ]
}
```

---

### 5. Ver Horarios de un Tutor (Público)

**Endpoint:** `GET /tutores/:tutorId/horarios`

**Headers:** Ninguno (ruta pública)

**Ejemplo:** `GET /tutores/1/horarios`

**Response (200 OK):**
```json
{
  "horarios": [
    {
      "id": 1,
      "fecha": "2025-11-30",
      "hora": "14:00",
      "estado": "disponible",
      "tutorId": 1
    },
    {
      "id": 2,
      "fecha": "2025-12-01",
      "hora": "16:00",
      "estado": "reservado",
      "tutorId": 1
    }
  ]
}
```

---

### 6. Ver Perfil Público de Tutor

**Endpoint:** `GET /tutores/:tutorId/perfil`

**Headers:** Ninguno (ruta pública)

**Ejemplo:** `GET /tutores/1/perfil`

**Response (200 OK):**
```json
{
  "tutor": {
    "id": 1,
    "materias": "Matemáticas, Física",
    "especialidad": "Cálculo diferencial",
    "descripcion": "Tutor con 5 años de experiencia",
    "usuario": {
      "nombre": "Jeanpierre Angarita",
      "correo": "jeanpierre@example.com"
    }
  }
}
```

---

### 7. Crear Horario (Solo Tutores)

**Endpoint:** `POST /tutores/horarios`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fecha": "2025-11-30",
  "hora": "14:00"
}
```

**Response (201 Created):**
```json
{
  "message": "Horario creado exitosamente",
  "horario": {
    "id": 1,
    "fecha": "2025-11-30",
    "hora": "14:00",
    "estado": "disponible",
    "tutorId": 1
  }
}
```

---

### 8. Obtener Perfil del Tutor (Autenticado)

**Endpoint:** `GET /tutores/perfil`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "tutor": {
    "id": 1,
    "usuarioId": 2,
    "materias": "Matemáticas, Física",
    "especialidad": "Cálculo diferencial",
    "descripcion": "Tutor con 5 años de experiencia",
    "usuario": {
      "id": 2,
      "nombre": "Jeanpierre Angarita",
      "correo": "jeanpierre@example.com",
      "rol": "tutor"
    }
  }
}
```

---

### 9. Actualizar Perfil del Tutor

**Endpoint:** `PUT /tutores/perfil`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "materias": "Matemáticas, Física, Química",
  "especialidad": "Cálculo integral y diferencial",
  "descripcion": "Tutor certificado con 5 años de experiencia en matemáticas avanzadas"
}
```

**Response (200 OK):**
```json
{
  "message": "Perfil actualizado exitosamente",
  "tutor": {
    "id": 1,
    "materias": "Matemáticas, Física, Química",
    "especialidad": "Cálculo integral y diferencial",
    "descripcion": "Tutor certificado con 5 años de experiencia en matemáticas avanzadas"
  }
}
```

---

## 📚 Tutorías

### 10. Solicitar Tutoría (Solo Estudiantes)

**Endpoint:** `POST /tutorias`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tutorId": 1,
  "horarioId": 1,
  "fecha": "2025-11-30",
  "hora": "14:00",
  "tema": "Derivadas e integrales"
}
```

**Response (201 Created):**
```json
{
  "message": "Solicitud de tutoría enviada",
  "tutoria": {
    "id": 1,
    "estudianteId": 1,
    "tutorId": 1,
    "horarioId": 1,
    "fecha": "2025-11-30",
    "hora": "14:00",
    "tema": "Derivadas e integrales",
    "estado": "pendiente"
  }
}
```

---

### 11. Ver Solicitudes de Tutorías (Solo Tutores)

**Endpoint:** `GET /tutorias/solicitudes`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "solicitudes": [
    {
      "id": 1,
      "fecha": "2025-11-30",
      "hora": "14:00",
      "tema": "Derivadas e integrales",
      "estado": "pendiente",
      "estudiante": {
        "id": 1,
        "usuario": {
          "nombre": "Silvia Jaimes",
          "correo": "silvia@example.com"
        }
      }
    }
  ]
}
```

---

### 12. Responder Solicitud de Tutoría (Solo Tutores)

**Endpoint:** `POST /tutorias/:id/responder`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Ejemplo:** `POST /tutorias/1/responder`

**Request Body (Aceptar):**
```json
{
  "accion": "aceptar"
}
```

**Request Body (Rechazar):**
```json
{
  "accion": "rechazar"
}
```

**Response (200 OK):**
```json
{
  "message": "Solicitud aceptada",
  "tutoria": {
    "id": 1,
    "fecha": "2025-11-30",
    "hora": "14:00",
    "estado": "aceptada"
  }
}
```

---

### 13. Registrar Resumen de Tutoría (Solo Tutores)

**Endpoint:** `POST /tutorias/:id/resumen`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Ejemplo:** `POST /tutorias/1/resumen`

**Request Body:**
```json
{
  "resumen": "Se explicaron conceptos de derivadas. El estudiante mostró buen entendimiento."
}
```

**Response (200 OK):**
```json
{
  "message": "Resumen registrado exitosamente",
  "tutoria": {
    "id": 1,
    "estado": "finalizada",
    "resumen": "Se explicaron conceptos de derivadas. El estudiante mostró buen entendimiento."
  }
}
```

---

### 14. Cancelar Tutoría (Solo Estudiantes)

**Endpoint:** `PATCH /tutorias/:id/cancelar`

**Headers:**
```
Authorization: Bearer <token>
```

**Ejemplo:** `PATCH /tutorias/1/cancelar`

**Response (200 OK):**
```json
{
  "message": "Tutoría cancelada exitosamente",
  "tutoria": {
    "id": 1,
    "estado": "cancelada"
  }
}
```

---

### 15. Ver Historial de Tutorías

**Endpoint:** `GET /tutorias/historial`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK) - Para Estudiante:**
```json
{
  "historiales": [
    {
      "id": 1,
      "fecha": "2025-11-30",
      "hora": "14:00",
      "tema": "Derivadas e integrales",
      "estado": "finalizada",
      "resumen": "Se explicaron conceptos de derivadas...",
      "tutor": {
        "id": 1,
        "materias": "Matemáticas, Física",
        "usuario": {
          "nombre": "Jeanpierre Angarita",
          "correo": "jeanpierre@example.com"
        }
      }
    }
  ]
}
```

**Response (200 OK) - Para Tutor:**
```json
{
  "historiales": [
    {
      "id": 1,
      "fecha": "2025-11-30",
      "hora": "14:00",
      "tema": "Derivadas e integrales",
      "estado": "finalizada",
      "resumen": "Se explicaron conceptos de derivadas...",
      "estudiante": {
        "id": 1,
        "usuario": {
          "nombre": "Silvia Jaimes",
          "correo": "silvia@example.com"
        }
      }
    }
  ]
}
```

---

### 16. Reporte de Tutorías (Solo Tutores)

**Endpoint:** `GET /tutorias/reporte`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "reporte": {
    "totalTutorias": 10,
    "tutoriasFinalizadas": 7,
    "tutoriasPendientes": 2,
    "tutoriasCanceladas": 1,
    "tutorias": [
      {
        "id": 1,
        "fecha": "2025-11-30",
        "hora": "14:00",
        "estado": "finalizada",
        "estudiante": {
          "usuario": {
            "nombre": "Silvia Jaimes"
          }
        }
      }
    ]
  }
}
```

## 🚀 Instalación y Configuración

### Backend

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` siguiendo el ejemplo del `.env.dev`:

4. **Crear base de datos**
```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tutorias_virtuales;
USE tutorias_virtuales;

-- Tabla de usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('estudiante', 'tutor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de estudiantes
CREATE TABLE estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nivel_academico VARCHAR(255),
  intereses TEXT,
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tutores
CREATE TABLE tutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  especialidad VARCHAR(255),
  descripcion TEXT,
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios
CREATE TABLE horarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tutor_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('disponible', 'ocupado', 'reservado', 'completado', 'cancelado') DEFAULT 'disponible',
  FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tutorías
CREATE TABLE tutorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT NOT NULL,
  tutor_id INT NOT NULL,
  horario_id INT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada', 'finalizada') DEFAULT 'pendiente',
  resumen TEXT,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE,
  FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_users_correo ON users(correo);
CREATE INDEX idx_estudiantes_usuario ON estudiantes(usuario_id);
CREATE INDEX idx_tutores_usuario ON tutores(usuario_id);
CREATE INDEX idx_horarios_tutor ON horarios(tutor_id);
CREATE INDEX idx_horarios_fecha ON horarios(fecha);
CREATE INDEX idx_tutorias_estudiante ON tutorias(estudiante_id);
CREATE INDEX idx_tutorias_tutor ON tutorias(tutor_id);
CREATE INDEX idx_tutorias_horario ON tutorias(horario_id);
CREATE INDEX idx_tutorias_fecha ON tutorias(fecha);
```

5. **Ejecutar servidor**
```bash
npm run dev
```

### Frontend

1. **Navegar a la carpeta**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` siguiendo el ejemplo del `.env.dev`:

4. **Ejecutar aplicación**
```bash
npm run dev
```

5. **Abrir en navegador**
```
http://localhost:5173
```

---

## 📝 Notas Importantes

- Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`
- Las fechas deben estar en formato `YYYY-MM-DD`
- Las horas deben estar en formato `HH:MM` (24 horas)
- Los tokens JWT expiran después de 24 horas
- Solo los tutores pueden crear horarios y responder solicitudes
- Solo los estudiantes pueden solicitar y cancelar tutorías
- El historial muestra diferentes datos según el rol (tutor/estudiante)

---

## 👥 Roles y Permisos

### Estudiante
- ✅ Buscar tutores
- ✅ Ver horarios disponibles
- ✅ Solicitar tutorías
- ✅ Cancelar tutorías propias
- ✅ Ver historial propio
- ❌ Crear horarios
- ❌ Aceptar/rechazar solicitudes
- ❌ Registrar resúmenes

### Tutor
- ✅ Crear horarios
- ✅ Ver solicitudes pendientes
- ✅ Aceptar/rechazar solicitudes
- ✅ Registrar resúmenes
- ✅ Ver historial de tutorías
- ✅ Ver reportes
- ✅ Actualizar perfil
- ❌ Solicitar tutorías
- ❌ Cancelar tutorías de estudiantes

---

## 🐛 Solución de Problemas

**Error: "Token inválido"**
- Verifica que estés incluyendo el header `Authorization: Bearer <token>`
- Verifica que el token no haya expirado (24 horas de validez)
- Intenta hacer login nuevamente

**Error: "Tutor no encontrado"**
- Crea al menos un horario para activar tu perfil de tutor
- Verifica que tu cuenta tenga el rol "tutor"

**Error: "Horario no disponible"**
- El horario ya fue reservado por otro estudiante
- Intenta con otro horario disponible
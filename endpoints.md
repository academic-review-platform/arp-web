# Endpoints API - ARP Core

Este archivo documenta todos los endpoints de la API. Cada sección corresponde a un grupo/módulo de rutas.

---

## 📌 Tabla de Contenidos

- [Auth](#-auth)
- [Courses](#-courses)
- [Topics](#-topics)
- [Sessions](#-sessions)
- [Assignments](#-assignments)
- [Bibliography](#-bibliography)
- [Notes](#-notes)
- [Submissions](#-submissions)
- [Reviews](#-reviews)
- [References](#-references)

---

## 📝 Auth

**File**: `src/modules/auth/auth.routes.ts`

### POST `/auth/login`

Inicia sesión de usuario.

**Entradas (Body)**:
- `email`: string (email válido)
- `password`: string (mínimo 8 caracteres)

**Salida**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@ejemplo.com",
    "firstname": "Nombre",
    "lastname": "Apellido"
  }
}
```

---

### POST `/auth/register`

Registra un nuevo usuario.

**Entradas (Body)**:
- `firstname`: string
- `lastname`: string
- `email`: string (email válido)
- `passwordHash`: string (mínimo 8 caracteres, debe contener: mayúscula, minúscula, número, caracter especial)

**Salida**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@ejemplo.com",
    "firstname": "Nombre",
    "lastname": "Apellido"
  }
}
```

---

## 📚 Courses

**File**: `src/modules/course/course.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/courses`

Obtiene todos los cursos del usuario autenticado.

**Entradas**: None

**Salida**:
```json
[
  {
    "id": "uuid",
    "title": "Título del curso",
    "description": "Descripción del curso",
    "enrollmentCode": "ABC123",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### POST `/courses`

Crea un nuevo curso.

**Entradas (Body)**:
- `title`: string (requerido)
- `description`: string (opcional)

**Salida**:
```json
{
  "id": "uuid",
  "title": "Título del curso",
  "description": "Descripción del curso",
  "enrollmentCode": "ABC123",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/courses/:id`

Obtiene un curso por su ID.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "title": "Título del curso",
  "description": "Descripción del curso",
  "enrollmentCode": "ABC123",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/courses/:id`

Actualiza un curso existente.

**Entradas (Params)**:
- `id`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `description`: string

**Salida**:
```json
{
  "id": "uuid",
  "title": "Título del curso actualizado",
  "description": "Descripción actualizada",
  "enrollmentCode": "ABC123",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/courses/:id`

Elimina un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**: 204 No Content

---

### POST `/courses/enroll`

Inscribe al usuario actual en un curso.

**Entradas (Body)**:
- `enrollmentCode`: string

**Salida**:
```json
{
  "userId": "uuid",
  "courseId": "uuid",
  "participantRole": "STUDENT",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/courses/:id/unenroll`

Desinscribe al usuario actual de un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**: 204 No Content

---

### DELETE `/courses/:id/disenroll`

Desinscribe a un usuario específico de un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Entradas (Body)**:
- `userId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/courses/:id/participants`

Obtiene los participantes de un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**:
```json
[
  {
    "userId": "uuid",
    "firstname": "Nombre",
    "lastname": "Apellido",
    "ParticipantRole": "OWNER | STUDENT | TEACHER | ASSISTANT"
  }
]
```

---

### GET `/courses/:id/topics`

Obtiene los temas de un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Título del tema",
    "description": "Descripción del tema",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### POST `/courses/:id/topics`

Crea un nuevo tema en un curso.

**Entradas (Params)**:
- `id`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `description`: string (opcional)

**Salida**:
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "Título del tema",
  "description": "Descripción del tema",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/courses/:courseId/bibliographies`

Obtiene las bibliografías de un curso.

**Entradas (Params)**:
- `courseId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "Título de la bibliografía",
    "url": "https://...",
    "bibliographyType": "PDF | WORD | POWERPOINT | URL",
    "mimeType": "application/pdf",
    "summary": "Resumen de la bibliografía",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "courseReference": {
      "courseId": "uuid",
      "bibliographyId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
]
```

---

### POST `/courses/:courseId/bibliographies`

Crea una bibliografía para un curso. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `courseId`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `url`: string (URI válida)
- `bibliographyType`: string ("PDF", "WORD", "POWERPOINT", "URL")
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Título de la bibliografía",
  "url": "https://...",
  "bibliographyType": "PDF | WORD | POWERPOINT | URL",
  "mimeType": "application/pdf",
  "summary": "Resumen de la bibliografía (generado automáticamente)",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "courseReference": {
    "courseId": "uuid",
    "bibliographyId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

## 📖 Topics

**File**: `src/modules/topic/topic.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/topics/:topicId`

Obtiene un tema por su ID.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "Título del tema",
  "description": "Descripción del tema",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/topics/:topicId`

Actualiza un tema existente.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `description`: string

**Salida**:
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "Título del tema actualizado",
  "description": "Descripción actualizada",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/topics/:topicId`

Elimina un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/topics/:topicId/sessions`

Obtiene las sesiones de un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "topicId": "uuid",
    "title": "Título de la sesión",
    "summary": "Resumen de la sesión",
    "contentMd": "Contenido en Markdown",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### POST `/topics/:topicId/sessions`

Crea una nueva sesión en un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `summary`: string
- `contentMd`: string

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la sesión",
  "summary": "Resumen de la sesión",
  "contentMd": "Contenido en Markdown",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/topics/:topicId/sessions/:sessionId`

Obtiene una sesión por su ID.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la sesión",
  "summary": "Resumen de la sesión",
  "contentMd": "Contenido en Markdown",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/topics/:topicId/sessions/:sessionId`

Actualiza una sesión existente.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `sessionId`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `summary`: string
- `contentMd`: string

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la sesión actualizado",
  "summary": "Resumen actualizado",
  "contentMd": "Contenido en Markdown actualizado",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/topics/:topicId/sessions/:sessionId`

Elimina una sesión.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/topics/:topicId/notes`

Obtiene las notas de un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "topicId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "document": {
      "id": "uuid",
      "currentVersionId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "currentVersion": {
      "id": "uuid",
      "documentId": "uuid",
      "url": "https://...",
      "mimeType": "application/pdf",
      "version": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
]
```

---

### POST `/topics/:topicId/notes`

Crea una nota para un tema. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Entradas (Body)**:
- `url`: string (URI válida)
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### GET `/topics/:topicId/notes/:documentId`

Obtiene una nota por su ID.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `documentId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/topics/:topicId/notes/:documentId`

Actualiza una nota existente. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `documentId`: string (UUID)

**Entradas (Body)**:
- `url`: string (URI válida)
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 2,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE `/topics/:topicId/notes/:documentId`

Elimina una nota.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `documentId`: string (UUID)

**Salida**: 204 No Content

---

### POST `/topics/:topicId/notes/:documentId/reviews`

Crea una reseña para una nota.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `documentId`: string (UUID)

**Entradas (Body)**:
- `reviewType`: string ("AI", "TEACHER")
- `score`: number (1-100)
- `comment`: string (opcional)

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI | TEACHER",
  "score": 85,
  "comment": "Excelente trabajo",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### POST `/topics/:topicId/notes/:documentId/reviews/ai`

Crea una reseña automática (AI) para una nota.

**Entradas (Params)**:
- `topicId`: string (UUID)
- `documentId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI",
  "score": 85,
  "comment": "Análisis automático realizado por IA",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/topics/:topicId/assignments`

Obtiene las tareas de un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "topicId": "uuid",
    "title": "Título de la tarea",
    "description": "Descripción de la tarea",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-01-15T00:00:00.000Z",
    "assignmentStatus": "DRAFT | ACTIVE | CLOSED",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### POST `/topics/:topicId/assignments`

Crea una nueva tarea en un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `description`: string
- `startDate`: string (date)
- `endDate`: string (date)
- `assignmentStatus`: string ("DRAFT", "ACTIVE", "CLOSED")

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la tarea",
  "description": "Descripción de la tarea",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-01-15T00:00:00.000Z",
  "assignmentStatus": "DRAFT | ACTIVE | CLOSED",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/topics/:topicId/bibliographies`

Obtiene las bibliografías de un tema.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "Título de la bibliografía",
    "url": "https://...",
    "bibliographyType": "PDF | WORD | POWERPOINT | URL",
    "mimeType": "application/pdf",
    "summary": "Resumen de la bibliografía",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "topicReference": {
      "topicId": "uuid",
      "bibliographyId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
]
```

---

### POST `/topics/:topicId/bibliographies`

Crea una bibliografía para un tema. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `topicId`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `url`: string (URI válida)
- `bibliographyType`: string ("PDF", "WORD", "POWERPOINT", "URL")
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Título de la bibliografía",
  "url": "https://...",
  "bibliographyType": "PDF | WORD | POWERPOINT | URL",
  "mimeType": "application/pdf",
  "summary": "Resumen de la bibliografía (generado automáticamente)",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "topicReference": {
    "topicId": "uuid",
    "bibliographyId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### GET `/download/:documentId`

Descarga un documento (nota). **No requiere autenticación en la ruta directa**.

**Entradas (Params)**:
- `documentId`: string (UUID)

**Salida**: Redirección a URL firmada con expiración de 15 minutos

---

## 📅 Sessions

**File**: `src/modules/session/session.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/sessions/:sessionId`

Obtiene una sesión por su ID.

**Entradas (Params)**:
- `sessionId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la sesión",
  "summary": "Resumen de la sesión",
  "contentMd": "Contenido en Markdown",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/sessions/:sessionId`

Actualiza una sesión existente.

**Entradas (Params)**:
- `sessionId`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `summary`: string
- `contentMd`: string

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la sesión actualizado",
  "summary": "Resumen actualizado",
  "contentMd": "Contenido en Markdown actualizado",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/sessions/:sessionId`

Elimina una sesión.

**Entradas (Params)**:
- `sessionId`: string (UUID)

**Salida**: 204 No Content

---

## 📋 Assignments

**File**: `src/modules/assignment/assignment.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/assignments/:assignmentId`

Obtiene una tarea por su ID.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la tarea",
  "description": "Descripción de la tarea",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-01-15T00:00:00.000Z",
  "assignmentStatus": "DRAFT | ACTIVE | CLOSED",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/assignments/:assignmentId`

Actualiza una tarea existente.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `description`: string
- `startDate`: string (date)
- `endDate`: string (date)
- `assignmentStatus`: string ("DRAFT", "ACTIVE", "CLOSED")

**Salida**:
```json
{
  "id": "uuid",
  "topicId": "uuid",
  "title": "Título de la tarea actualizado",
  "description": "Descripción actualizada",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-01-15T00:00:00.000Z",
  "assignmentStatus": "DRAFT | ACTIVE | CLOSED",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/assignments/:assignmentId`

Elimina una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/assignments/:assignmentId/submissions`

Obtiene las entregas de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "assignmentId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "document": {
      "id": "uuid",
      "currentVersionId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "currentVersion": {
      "id": "uuid",
      "documentId": "uuid",
      "url": "https://...",
      "mimeType": "application/pdf",
      "version": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
]
```

---

### POST `/assignments/:assignmentId/submissions`

Crea una nueva entrega para una tarea. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Entradas (Body)**:
- `url`: string (URI válida)
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "assignmentId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### GET `/assignments/:assignmentId/submissions/:documentId`

Obtiene una entrega por su ID.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "assignmentId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/assignments/:assignmentId/submissions/:documentId`

Actualiza una entrega existente. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Entradas (Body)**:
- `url`: string (URI válida)
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "assignmentId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 2,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH `/assignments/:assignmentId/submissions/:documentId`

Actualiza el estado de una entrega.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Entradas (Body)**:
- `status`: string ("DRAFT", "SUBMITTED", "UNDER_REVIEW", "GRADED")

**Salida**:
```json
{
  "id": "uuid",
  "assignmentId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "id": "uuid",
    "currentVersionId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "currentVersion": {
    "id": "uuid",
    "documentId": "uuid",
    "url": "https://...",
    "mimeType": "application/pdf",
    "version": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE `/assignments/:assignmentId/submissions/:documentId`

Elimina una entrega.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Salida**: 204 No Content

---

### POST `/assignments/:assignmentId/submissions/:documentId/reviews`

Crea una reseña para una entrega.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Entradas (Body)**:
- `reviewType`: string ("AI", "TEACHER")
- `score`: number (1-100)
- `comment`: string (opcional)

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI | TEACHER",
  "score": 85,
  "comment": "Excelente trabajo",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### POST `/assignments/:assignmentId/submissions/:documentId/reviews/ai`

Crea una reseña automática (AI) para una entrega.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `documentId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI",
  "score": 85,
  "comment": "Análisis automático realizado por IA",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### GET `/assignments/:assignmentId/bibliographies`

Obtiene las bibliografías de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "Título de la bibliografía",
    "url": "https://...",
    "bibliographyType": "PDF | WORD | POWERPOINT | URL",
    "mimeType": "application/pdf",
    "summary": "Resumen de la bibliografía",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "assignmentReference": {
      "assignmentId": "uuid",
      "bibliographyId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
]
```

---

### POST `/assignments/:assignmentId/bibliographies`

Crea una bibliografía para una tarea. **Depende de subida de archivo (formData)**.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Entradas (Body)**:
- `title`: string
- `url`: string (URI válida)
- `bibliographyType`: string ("PDF", "WORD", "POWERPOINT", "URL")
- `mimeType`: string

**Salida**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Título de la bibliografía",
  "url": "https://...",
  "bibliographyType": "PDF | WORD | POWERPOINT | URL",
  "mimeType": "application/pdf",
  "summary": "Resumen de la bibliografía (generado automáticamente)",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "assignmentReference": {
    "assignmentId": "uuid",
    "bibliographyId": "uuid",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### POST `/assignments/:assignmentId/bibliographies/:bibliographyId`

Agrega una referencia de bibliografía a una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `bibliographyId`: string (UUID)

**Salida**:
```json
{
  "assignmentId": "uuid",
  "bibliographyId": "uuid",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/assignments/:assignmentId/bibliographies/:bibliographyId`

Elimina una referencia de bibliografía de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `bibliographyId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/assignments/:assignmentId/references`

Obtiene las referencias de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**: Array de referencias

---

### POST `/assignments/:assignmentId/references/:sessionId`

Agrega una referencia (sesión) a una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**: Referencia creada

---

### DELETE `/assignments/:assignmentId/references/:sessionId`

Elimina una referencia (sesión) de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**: 204 No Content

---

### GET `/assignments/download/:documentId`

Descarga un documento (entrega). **No requiere autenticación en la ruta directa**.

**Entradas (Params)**:
- `documentId`: string (UUID)

**Salida**: Redirección a URL del archivo

---

## 📚 Bibliography

**File**: `src/modules/bibliography/bibliography.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/bibliographies/:bibliographyId`

Obtiene una bibliografía por su ID.

**Entradas (Params)**:
- `bibliographyId`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Título de la bibliografía",
  "url": "https://...",
  "bibliographyType": "PDF | WORD | POWERPOINT | URL",
  "mimeType": "application/pdf",
  "summary": "Resumen de la bibliografía",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/bibliographies/:bibliographyId`

Actualiza una bibliografía existente.

**Entradas (Params)**:
- `bibliographyId`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `title`: string
- `summary`: string
- `bibliographyType`: string ("PDF", "WORD", "POWERPOINT", "URL")

**Salida**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Título de la bibliografía actualizado",
  "url": "https://...",
  "bibliographyType": "PDF | WORD | POWERPOINT | URL",
  "mimeType": "application/pdf",
  "summary": "Resumen de la bibliografía",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/bibliographies/:bibliographyId`

Elimina una bibliografía.

**Entradas (Params)**:
- `bibliographyId`: string (UUID)

**Salida**: 204 No Content

---

## 📝 Reviews

**File**: `src/modules/review/review.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/reviews/:id`

Obtiene una reseña por su ID.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI | TEACHER",
  "score": 85,
  "comment": "Excelente trabajo",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### PUT `/reviews/:id`

Actualiza una reseña existente.

**Entradas (Params)**:
- `id`: string (UUID)

**Entradas (Body)** - Al menos uno requerido:
- `score`: number (1-100)
- `comment`: string

**Salida**:
```json
{
  "id": "uuid",
  "documentId": "uuid",
  "reviewType": "AI | TEACHER",
  "score": 90,
  "comment": "Trabajo mejorado",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### DELETE `/reviews/:id`

Elimina una reseña.

**Entradas (Params)**:
- `id`: string (UUID)

**Salida**: 204 No Content

---

### GET `/reviews/document/:documentId`

Obtiene las reseñas de un documento.

**Entradas (Params)**:
- `documentId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "documentId": "uuid",
    "reviewType": "AI | TEACHER",
    "score": 85,
    "comment": "Excelente trabajo",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/reviews/assignment/:assignmentId`

Obtiene las reseñas de un usuario para una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**:
```json
[
  {
    "id": "uuid",
    "documentId": "uuid",
    "reviewType": "AI | TEACHER",
    "score": 85,
    "comment": "Excelente trabajo",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## 🔗 References

**Nota**: Las rutas de referencias están definidas en `src/modules/assignment/assignment.routes.ts`

**Nota**: Todas las rutas requieren autenticación.

### GET `/assignments/:assignmentId/references`

Obtiene las referencias de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)

**Salida**: Array de referencias

---

### POST `/assignments/:assignmentId/references/:sessionId`

Agrega una referencia (sesión) a una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**: Referencia creada

---

### DELETE `/assignments/:assignmentId/references/:sessionId`

Elimina una referencia (sesión) de una tarea.

**Entradas (Params)**:
- `assignmentId`: string (UUID)
- `sessionId`: string (UUID)

**Salida**: 204 No Content

---

## 📌 Notas Importantes

1. **Autenticación**: La mayoría de los endpoints requieren autenticación mediante middleware `authenticate`.

2. **Subida de Archivos**: Los endpoints que mencionan `uploadDocument('documents')` o `uploadDocument('bibliography')` dependen de form-data con archivos.

3. **Parámetros**: La mayoría de los endpoints usan UUIDs como identificadores.

4. **Middleware**: Los endpoints utilizan validación con `validateBody` y `validateParams` basados en esquemas Joi.

---

## 📅 Actualización

Última actualización: 2026-06-29

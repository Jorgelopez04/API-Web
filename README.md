# Mi Boleta: "¿Y si sí me lo gané?"

Aplicación web para registrar y administrar boletas, rifas, loterías y sorteos en un solo lugar: guarda el número jugado, la fecha del sorteo, el valor apostado y si la boleta quedó pendiente, ganada o perdida.

Práctica individual de frontend. **El frontend (carpeta `frontend/`) es mi trabajo.** La API REST que consume (carpetas `src/`, `prisma/` y `database/`) fue suministrada por el curso.

<!-- Agrega aquí capturas del dashboard, de la lista de boletas y de la página de administrador -->

## Tecnologías

- **React** y **TypeScript**
- **Vite**
- **React Router** para la navegación y la protección de rutas
- **Context API** para la sesión del usuario
- Consumo de una API REST con autenticación **JWT**

## Funcionalidades

**Autenticación**

- Registro e inicio de sesión
- La sesión se guarda en `localStorage` y sobrevive a recargar la página
- Cierre de sesión

**Boletas y sorteos** (`/tickets`)

- Crear, ver, editar y eliminar boletas
- Cada boleta guarda nombre del sorteo, número jugado, fecha, valor apostado, lugar de compra, notas, tipo de juego (lotería, rifa, sorteo, boleta o juego ocasional) y estado (pendiente, ganado o perdido)

**Dashboard** (`/dashboard`)

- Cantidad de juegos registrados
- Sorteos próximos y juegos pendientes
- Gráfica de dona con el reparto entre pendientes, ganados y perdidos
- Historial de boletas

**Página de administrador** (`/admin`, solo para usuarios con rol `admin`)

- Búsqueda por nombre o número
- Filtros por estado y por tipo de juego
- Paginación de 10 registros por página

**Rutas protegidas**

- `/dashboard` y `/tickets` requieren sesión
- `/admin` requiere además el rol `admin`
- Si no hay sesión, redirige a `/login`

## Estructura del repositorio

| Carpeta | Contenido | Autoría |
| --- | --- | --- |
| `frontend/` | Aplicación web en React | Mía |
| `src/`, `prisma/`, `database/` | API REST en Express, Prisma y PostgreSQL | Suministrada por el curso |
| `docs/` | Enunciado de la práctica y documentación de la API (`enunciado-y-api.md`), rúbrica y colección de Postman | Suministrada por el curso |

## Cómo ejecutarlo

### Requisitos

- Node.js 20 o superior
- Una API de Mi Boleta en ejecución: la remota del curso o la local de este repositorio

### Frontend

```bash
cd frontend
npm install
```

Copia `frontend/.env.example` a `frontend/.env` y define la URL de la API:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

```bash
npm run dev
```

Abre `http://localhost:5173`.

### API local (opcional)

Desde la raíz del repositorio:

```bash
npm install
```

Crea un `.env` basado en `.env.example` con `DATABASE_URL`, `JWT_SECRET` y `PORT=4000`, y luego:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Para probar la página de administrador, promueve un usuario desde la base de datos:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

## Autor

Frontend desarrollado por [Jorge Steven López Arenas](https://github.com/Jorgelopez04).

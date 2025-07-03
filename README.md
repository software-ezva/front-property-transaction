# Property Transaction Frontend

## Configuración del entorno

1. Copia el archivo `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Actualiza las variables de entorno en `.env.local` con tus propios valores:

```
# URL base de la ApiClientSide incluyendo /v1
BACKEND_API_URL='http://localhost:5698/api/v1'
NEXT_PUBLIC_BACKEND_API_URL='http://localhost:5698/api/v1'
```

3. Asegúrate de que la ApiClientSide backend esté funcionando en la URL especificada.

### Resolución de problemas de ApiClientSide

Si experimentas errores 404 al conectar con la ApiClientSide:

1. Verifica que la ApiClientSide backend esté corriendo correctamente
2. Comprueba que las rutas en tu `.env.local` no incluyan `/v1` (debe ser parte del endpoint)
3. Prueba usar el proxy local añadiendo `/api/proxy/` antes de tus endpoints
4. Verifica en los logs del servidor si hay errores de conexión

## Rutas de ApiClientSide utilizadas

- `POST /api/v1/profiles/agent` - Asignar perfil de agente inmobiliario al usuario
- `POST /api/v1/profiles/client` - Asignar perfil de cliente al usuario

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Producción

```bash
pnpm build
pnpm start
```
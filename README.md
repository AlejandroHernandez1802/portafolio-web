# portafolio-web

Portafolio de servicios web. La documentación del proyecto está en [docs/](./docs/README.md).

## Servidor de desarrollo

Desde esta carpeta (`code/`):

```bash
nvm use        # Node 24 según .nvmrc; tu Node por defecto (26) no tiene pnpm
pnpm install   # solo la primera vez o cuando cambie pnpm-lock.yaml
pnpm dev       # http://localhost:3000
```

- En `pnpm dev`, `/` no redirige porque no corre el Worker. Abre <http://localhost:3000/es> o <http://localhost:3000/en>.
- Para probar como en Cloudflare (Worker, `_headers`, redirección de `/` y página 404), usa `pnpm preview`: hace el build y sirve `out/` en <http://localhost:8787>.
- Detén cualquiera de los dos con `Ctrl+C`.

Los demás scripts (`lint`, `typecheck`, `media:*`…) están explicados en [docs/02 §3](./docs/02-stack-tecnologico.md#3-entorno-local).

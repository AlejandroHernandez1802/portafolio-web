@AGENTS.md

# Portafolio — reglas para agentes

- Lee docs/README.md y el doc de la tarea antes de escribir código. Las tareas tienen ID en docs/13-plan-de-implementacion.md.
- Las decisiones de docs/14-decisiones.md no se cambian sin preguntarme. Si una tarea exige cambiarlas, propón un ADR nuevo.
- Next.js 16.3 App Router con `output: 'export'`, publicado en Cloudflare Workers (plan Free). No agregues proxy.ts, Server Actions, Route Handlers dinámicos, librerías de UI, de i18n ni de animación sin un ADR.
- Redirecciones y endpoints van en worker/index.ts; encabezados en public/_headers. Enlaces internos con `<a>`, no con next/link.
- Todo texto visible vive en src/content/{en,es}.ts. Nunca escribas copy dentro de los componentes.
- Presupuestos: LCP < 2,5 s, CLS < 0,1, animación del hero 0 KB de JS. Ver docs/11.
- Código, identificadores y comentarios en inglés. Docs en español.
- Node 24 (`nvm use`) y pnpm 12. Antes de cerrar una tarea: `pnpm lint`, `pnpm typecheck` y `pnpm preview` sin errores.

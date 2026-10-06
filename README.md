# Centro Médico Nova · Web institucional

Demo ficticia de portfolio desarrollada por Anduril Tech. La experiencia pública está dirigida al paciente: conocer el centro y solicitar un turno online. El dashboard, las tablas, la base de pacientes y las rutas administrativas fueron eliminados.

## Ejecutar

```sh
pnpm install
pnpm run dev
```

Abrir http://localhost:3000. Se utiliza pnpm 11 y un único `pnpm-lock.yaml`. El script de instalación de esbuild está autorizado específicamente en `pnpm-workspace.yaml`.

## Recorrido público

- Home: presentación, información rápida, seis especialidades, institución, equipo, novedades, turnos, información útil y contacto.
- `/nosotros`: presentación institucional.
- `/profesionales` y `/profesionales/[slug]`: equipo y fichas individuales.
- `/especialidades` y `/especialidades/[slug]`: presentación de cada área y su equipo.
- `/novedades/[slug]`: novedades completas e ilustrativas.
- `/turnos`: datos propios → especialidad → profesional → calendario y horario → revisión → pantalla de éxito con número de reserva.

Los CTAs comparten el mismo flujo y pueden preseleccionar especialidad y profesional mediante parámetros. No se muestran datos de otros pacientes ni estados internos. El calendario solo permite reservar días con espacios libres; respeta horarios individuales, excepciones y reservas existentes.

## Datos y alcance

La fecha simulada de la demo es el **06/10/2026**. Se ofrecen los próximos 30 días. La Dra. Sofía Martínez no atiende el 12/10 y atiende de 10 a 12 el 15/10. El 14/10, Dermatología tiene todos los horarios ocupados. Son ejemplos para verificar las reglas.

Las reservas se mantienen en memoria durante la navegación, incluso al volver al inicio y pedir otro turno. Se reinician al recargar. Los datos personales se utilizan únicamente en el formulario y su confirmación; no se guardan en localStorage ni se transmiten a servidores. No existe backend, autenticación, envío de email/WhatsApp, gestión clínica ni cancelación real. Usar exclusivamente datos ficticios.

## Arquitectura

- `src/app`: páginas y metadata. El contenido institucional se renderiza con Server Components.
- `src/components/home`, `layout`, `specialties`, `professionals`, `news`: componentes de la web pública.
- `src/components/appointments`: formulario, selecciones, calendario, revisión, éxito y proveedor de reservas.
- `src/features/appointment-flow.tsx`: coordinación del flujo público.
- `src/data`: especialidades, profesionales, horarios, espacios ocupados, novedades e institución.
- `src/lib`: reglas puras, validación del formulario, fechas y SEO centralizado.
- `src/styles`: estilos base, institucionales y del recorrido de turnos.
- `src/types`: contratos compartidos.
- `public/images`: ocho fotografías ficticias generadas, optimizadas a WebP. Se sirven con next/image y sizes explícitos.

La integración futura con Django REST Framework puede reemplazar `reserve` en el proveedor y la consulta de disponibilidad sin rehacer los pasos visuales. `reserve` ya tiene contrato asíncrono y feedback de error. La API real deberá comprobar disponibilidad nuevamente y resolver reservas concurrentes de forma transaccional. La protección local cubre la sesión de la demo.

## Diseño y accesibilidad

Manrope e Instrument Serif locales mediante next/font: interfaz legible y acentos editoriales en títulos. Los tokens de color, superficies, radios, espaciado y duración se centralizan en `src/styles/base.css`. Verde profundo, teal sanitario, mint y superficies cálidas; los estados de interacción y de reserva comparten la misma paleta.

El grid de lectura convive con un contenedor amplio para el CTA y composiciones abiertas hacia los bordes: hero a la derecha, institución a la izquierda, profesionales a la derecha y novedades a la izquierda. Las especialidades adoptan filas editoriales en dos columnas en desktop; móvil conserva una estructura simple. El navbar muestra hover y estado activo invertido, con scroll spy mediante IntersectionObserver y selección por categoría en páginas interiores. Las anclas respetan el offset del header y movimiento reducido.

Menú móvil con Radix Dialog, radios nativos para selecciones, errores asociados a campos, foco entre pasos y calendario sin input de fecha. Los carruseles de profesionales y novedades permiten swipe, arrastre con mouse, flechas, Home/End y teclado; no tienen autoplay. FAQ con Radix Accordion, un único panel expandido y navegación por teclado. El ejemplo de horarios del CTA tiene estado visual independiente y no realiza reservas.

Motion se configura en `NovaMotion`: entrada coordinada del hero, reveals una sola vez desde abajo o desde los laterales y transiciones cortas. `prefers-reduced-motion` desactiva animaciones, desplazamientos suaves y transiciones, manteniendo todo el contenido visible. En móvil, el formulario presenta el paso actual y una barra de progreso animada con transform; la lógica de reserva se conserva.

SEO centralizado en `src/lib/seo.ts`, con **noindex/nofollow** por tratarse de una institución ficticia. La identidad, ubicación, teléfonos, nombres e imágenes son ilustrativos. Los textos públicos no brindan consejos médicos.

## Verificación

```sh
pnpm run typecheck
pnpm test
pnpm run build
```

Con el servidor activo:

```sh
node scripts/audit.mjs
node scripts/accessibility.mjs
node scripts/polish.mjs
```

La auditoría usa Microsoft Edge en modo headless y recorre páginas públicas a 320, 375, 390, 430, 768, 1024, 1280 y 1440 px. Verifica formularios, preselecciones, calendario, reserva, confirmación, persistencia durante la navegación, prevención de duplicados y ausencia de rutas administrativas. Recorre también los slides fuera de pantalla antes de comprobar las imágenes diferidas. La auditoría de accesibilidad usa axe para contrastes, estructura y formularios en páginas y pasos de reserva. `polish.mjs` verifica los dos carruseles, arrastre sin activar enlaces, swipe táctil, límites, teclado, accordion, movimiento reducido, scroll spy y geometría de las composiciones abiertas. Capturas y resultados en `artifacts/public/` y `artifacts/polish/after/`. Permite cambiar el destino con `NOVA_BASE_URL`.

Los prompts y el origen de los assets se documentan en `artifacts/image-prompts.json`. Los originales generados se conservan fuera del proyecto; solo los WebP optimizados se distribuyen con la web. Las licencias de Manrope e Instrument Serif se incluyen junto a las fuentes.

Los archivos locales de agentes de IA, las cachés, los informes y capturas de auditoría, los prompts de generación y el script local de preparación de imágenes están excluidos del repositorio mediante `.gitignore`. Las imágenes finales de la web sí se versionan en `public/images/`.

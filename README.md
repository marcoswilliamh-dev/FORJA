# FORJA 2.2

Versión con el nuevo personaje amarillo como icono nativo de Android y como logo dentro de la aplicación.

- Icono nativo: `resources/icon.png`
- Logo dentro de la app: `src/assets/forja-logo.png`
- El workflow genera los recursos Android con `@capacitor/assets`.


## v2.3 — hábitos diarios
- Las misiones/hábitos marcados se guardan por fecha.
- Al comenzar un nuevo día, todas las casillas diarias aparecen desmarcadas.
- El historial conserva lo realizado en días anteriores.
- Se usa la fecha local del teléfono para evitar cambios de día incorrectos por UTC.
- Si la app queda abierta al pasar medianoche, actualiza automáticamente el día.

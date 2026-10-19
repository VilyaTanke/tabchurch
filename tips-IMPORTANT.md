TIP

Al hacer cambios importantes en local DB y quieres que viajen al servidor, solo tienes que hacer:

npm run db:export (en tu PC para actualizar el archivo SQL con los nuevos datos).
Hacer git commit y git push.
En el servidor, ejecutar npm run db:seed.
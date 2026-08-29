# Configurar prisma

Se debe crear la base de datos desde el dashboard de [Prisma](https://supabase.com/dashboard/sign-in)

**RECORDAR LA CLAVE**

Una vez dentro del dashboard, debería verse algo así 

![alt text](image.png)

Ya tenemos la base de datos creada y lista para usarla

Debemos obtener las credenciales, **DIRECT_URL** y **DATABASE_URL**, ambas se sacan del navbar superior

![alt text](image-1.png)

Al hacer click en el botón **Connect** se abre el siguiente modal

![alt text](image-2.png)

Se debe verificar que esté seleccionada la opción **Direct**

Debajo aparece la sección de **Connection Method** con tres opciones; las que nos importan son **Transaction Pooler** y **Session Pooler**

Seleccionando **Transaction Pooler** obtenemos el string para **DATABASE_URL** en el mismo modal bajando se encuentra el string 

**Verificar que en type este seleccionada la opción URI**

![alt text](image-3.png)

Debe tener el siguiente formato 

postgresql://postgres.[PROJECT_ID]:[YOUR-PASSWORD]@aws-1-us-west-2.pooler.supabase.com:6543/postgres

**Se debe reemplazar el YOUR_PASSWORD por la contraseña que le asignaron a la db inicialmente**

De igual manera, obtenemos el string para **DIRECT_URL**, primero seleccionamos **Session Pooler**, bajamos y encontramos el string, que debe tener el siguiente formato

**Verificar que en type este seleccionada la opción URI**

postgresql://postgres.[PROJECT_ID]:[YOUR-PASSWORD]@aws-1-us-west-2.pooler.supabase.com:5432/postgres

**Se debe reemplazar el YOUR_PASSWORD por la contraseña que le asignaron a la db inicialmente**

![alt text](image-4.png)

Una vez obtenidas las variables, ya podemos migrar los modelos y relaciones. 

Primero agregamos las variables de entorno al archivo **.env** del **Back-End**

```env
DIRECT_URL = 

DATABASE_URL = 
```

**Verificar que el archivo **/Back-End/prisma/schema.prisma** tenga el siguiente objeto, con las variables de entorno**

```
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Ahora si, podemos migrar. Desde la carpeta **/Back-End**, debemos ejecutar los siguientes comandos: 

```
pnpm run build // Crea una carpeta **generated**

npx prisma migrate dev --name init // Migra las relaciones y modelos
```
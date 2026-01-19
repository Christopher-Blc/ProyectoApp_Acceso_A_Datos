import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/user.entity';

export const ROLES_KEY = 'roles';
//decorador personalizado que asigna roles a un controlador
//los roles los recibe como parametros (los roles estan difinidos en el Users.entity)
//el decorador solo almacena los roles en los metadatos del controlador o metodo y no realiza ninguna logica de autorizacion
//ROLES_KEY es la clave con la que se almacenan los roles en los metadatos y , roles es un array de roles permitidos
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

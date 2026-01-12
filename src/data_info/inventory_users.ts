import { UserRole } from "../users/user.entity";

export default [

    {
        name: 'Christopher',
        surname: 'Bolocan',
        email: 'chris@bolocan.com',
        phone: '634323242',
        password: 'chris',
        role: UserRole.GESTOR_RESERVAS,
        isActive: true,
        fecha_registro: new Date('2025-10-23T08:00:00'),
        fecha_ultimo_login: new Date('2025-10-23T09:00:00') ,
        fecha_nacimiento: new Date('2007-10-23T09:00:00'),
        direccion: 'C/ Casa al costat de la de Carolina'

    },
]
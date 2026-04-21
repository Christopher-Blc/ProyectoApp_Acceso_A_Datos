import { tipoNoti } from "../../modules/noti/entities/noti.entity"

export default [
    {
        user_id: 1, 
        mensaje: 'Tienes una partida hoy',
        tipoNoti: tipoNoti.RECORDATORIO,
        leida: true,
        fecha: new Date('2025-10-27T10:24:04')
    }
]
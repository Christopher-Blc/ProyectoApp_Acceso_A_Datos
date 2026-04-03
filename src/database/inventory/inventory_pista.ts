import { EstadoPista, DiaSemana } from "../../modules/pista/entities/pista.entity";

export default [
    {
        instalacion_id: 1,
        tipo_pista_id: 1, // ID del TipoPista (Tenis, etc.)
        nombre: 'Pista Central Tenis',
        capacidad: 4,
        precio_hora: 15.50,
        cubierta: true, // Cambiado de cobertura (enum) a cubierta (boolean)
        iluminacion: true,
        descripcion: 'Pista de tenis con iluminación nocturna y superficie rápida.',
        estado: EstadoPista.DISPONIBLE,
        hora_apertura: '08:00:00',
        hora_cierre: '22:00:00',
        dia_semana: DiaSemana.LUNES // Campo obligatorio por el @Unique de la Entity
    },
    {
        instalacion_id: 1,
        tipo_pista_id: 2,
        nombre: 'Pista Padel 1',
        capacidad: 4,
        precio_hora: 10.00,
        cubierta: false,
        iluminacion: true,
        descripcion: 'Pista de pádel de cristal.',
        estado: EstadoPista.DISPONIBLE,
        hora_apertura: '08:00:00',
        hora_cierre: '22:00:00',
        dia_semana: DiaSemana.LUNES
    }
];
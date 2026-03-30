import { CoberturaPista, EstadoPista, tipo_pista } from "../pista/pista.entity";

export default[

    {
        instalacion_id: 1,
        tipo_pista: tipo_pista.OTRO,
        capacidad: 4,
        precio_hora: 5,
        cobertura: CoberturaPista.CUBIERTA,
        iluminacion: true,
        descripcion: 'Es una pista de tenis y tal',
        estado: EstadoPista.DISPONIBLE,
        numero: 1
      
    },

]
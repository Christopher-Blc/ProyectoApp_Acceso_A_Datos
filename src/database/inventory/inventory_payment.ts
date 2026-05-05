import {
  metodo_pago,
  estado_pago,
} from '../../modules/payment/entities/payment.entity';

export default [
  {
    reserva_id: 1,
    monto: 150.75,
    fecha_Payment: new Date('2025-11-01T10:30:00'),
    metodo_pago: metodo_pago.VISA,
    estado_pago: estado_pago.PAGADO,
    nota: 'Payment realizado con éxito',
  },
  {
    reserva_id: 2,
    monto: 200.0,
    fecha_Payment: new Date('2025-11-02T12:45:00'),
    metodo_pago: metodo_pago.PAY_PAL,
    estado_pago: estado_pago.NO_PAGADO,
    nota: 'Payment pendiente de confirmación',
  },
];








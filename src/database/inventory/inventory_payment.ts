import {
  PaymentMethod,
  PaymentStatus,
} from '../../modules/payment/entities/payment.entity';

export default [
  {
    reservation_id: 1,
    amount: 150.75,
    payment_date: new Date('2025-11-01T10:30:00'),
    payment_method: PaymentMethod.VISA,
    payment_status: PaymentStatus.PAGADO,
    nota: 'Payment realizado con éxito',
  },
  {
    reservation_id: 2,
    amount: 200.0,
    payment_date: new Date('2025-11-02T12:45:00'),
    payment_method: PaymentMethod.PAY_PAL,
    payment_status: PaymentStatus.NO_PAGADO,
    nota: 'Payment pendiente de confirmación',
  },
];

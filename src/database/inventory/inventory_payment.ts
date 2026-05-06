import {
  PaymentMethod,
  PaymentStatus,
} from '../../modules/payment/entities/payment.entity';

export default [
  {
    reservationId: 1,
    amount: 150.75,
    paymentDate: new Date('2025-11-01T10:30:00'),
    paymentMethod: PaymentMethod.VISA,
    paymentStatus: PaymentStatus.PAID,
    note: 'Payment realizado con éxito',
  },
  {
    reservationId: 2,
    amount: 200.0,
    paymentDate: new Date('2025-11-02T12:45:00'),
    paymentMethod: PaymentMethod.PAYPAL,
    paymentStatus: PaymentStatus.UNPAID,
    note: 'Payment pendiente de confirmación',
  },
];

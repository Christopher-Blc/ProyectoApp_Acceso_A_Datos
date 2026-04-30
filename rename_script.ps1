$srcPath = "c:\Users\javig\OneDrive\Escritorio\ProyectoApp_Acceso_A_Datos\src"

# All replacement pairs: old => new
$replacements = @{
    # Reserva -> Reservation
    "ReservaModule" = "ReservationModule"
    "ReservaService" = "ReservationService"
    "ReservaController" = "ReservationController"
    "ReservaDto" = "ReservationDto"
    "CreateReservaDto" = "CreateReservationDto"
    "UpdateReservaDto" = "UpdateReservationDto"
    "from './reserva" = "from './reservation"
    "from '../reserva" = "from '../reservation"
    "from '../../modules/reserva" = "from '../../modules/reservation"
    "from '../../../modules/reserva" = "from '../../../modules/reservation"
    "'../reserva" = "'../reservation"
    "reserva.service" = "reservation.service"
    "reserva.controller" = "reservation.controller"
    "reserva.entity" = "reservation.entity"
    "reserva.dto" = "reservation.dto"
    "Reserva " = "Reservation "
    "Reserva," = "Reservation,"
    "Reserva\>" = "Reservation>"
    "Reserva\[" = "Reservation["
    
    # Pista -> Court
    "PistaModule" = "CourtModule"
    "PistaService" = "CourtService"
    "PistaController" = "CourtController"
    "PistaDto" = "CourtDto"
    "UpdatePistaDto" = "UpdateCourtDto"
    "from './pista" = "from './court"
    "from '../pista" = "from '../court"
    "from '../../modules/pista" = "from '../../modules/court"
    "from '../../../modules/pista" = "from '../../../modules/court"
    "pista.service" = "court.service"
    "pista.controller" = "court.controller"
    "pista.entity" = "court.entity"
    "pista.dto" = "court.dto"
    "Pista " = "Court "
    "Pista," = "Court,"
    
    # TipoPista -> CourtType
    "TipoPistaModule" = "CourtTypeModule"
    "TipoPistaService" = "CourtTypeService"
    "TipoPistaController" = "CourtTypeController"
    "TipoPistaDto" = "CourtTypeDto"
    "from './tipo_pista" = "from './court_type"
    "from '../tipo_pista" = "from '../court_type"
    "from '../../modules/tipo_pista" = "from '../../modules/court_type"
    "from '../../../modules/tipo_pista" = "from '../../../modules/court_type"
    "tipo_pista.service" = "court_type.service"
    "tipo_pista.controller" = "court_type.controller"
    "tipo_pista.entity" = "court_type.entity"
    "tipo_pista.dto" = "court_type.dto"
    "TipoPista " = "CourtType "
    "TipoPista," = "CourtType,"
    
    # Instalacion -> Installation
    "InstalacionModule" = "InstallationModule"
    "InstalacionService" = "InstallationService"
    "InstalacionController" = "InstallationController"
    "InstalacionDto" = "InstallationDto"
    "from './instalacion" = "from './installation"
    "from '../instalacion" = "from '../installation"
    "from '../../modules/instalacion" = "from '../../modules/installation"
    "from '../../../modules/instalacion" = "from '../../../modules/installation"
    "instalacion.service" = "installation.service"
    "instalacion.controller" = "installation.controller"
    "instalacion.entity" = "installation.entity"
    "instalacion.dto" = "installation.dto"
    "Instalacion " = "Installation "
    "Instalacion," = "Installation,"
    
    # Resenya -> Review
    "ResenyaModule" = "ReviewModule"
    "ResenyaService" = "ReviewService"
    "ResenyaController" = "ReviewController"
    "ResenyaDto" = "ReviewDto"
    "CreateResenyaDto" = "CreateReviewDto"
    "UpdateResenyaDto" = "UpdateReviewDto"
    "from './resenya" = "from './review"
    "from '../resenya" = "from '../review"
    "from '../../modules/resenya" = "from '../../modules/review"
    "from '../../../modules/resenya" = "from '../../../modules/review"
    "resenya.service" = "review.service"
    "resenya.controller" = "review.controller"
    "resenya.entity" = "review.entity"
    "resenya.dto" = "review.dto"
    "Resenya " = "Review "
    "Resenya," = "Review,"
    
    # Noti -> Notification
    "NotiModule" = "NotificationModule"
    "NotiService" = "NotificationService"
    "NotiController" = "NotificationController"
    "NotiDto" = "NotificationDto"
    "from './noti" = "from './notification"
    "from '../noti" = "from '../notification"
    "from '../../modules/noti" = "from '../../modules/notification"
    "from '../../../modules/noti" = "from '../../../modules/notification"
    "noti.service" = "notification.service"
    "noti.controller" = "notification.controller"
    "noti.entity" = "notification.entity"
    "noti.dto" = "notification.dto"
    "Noti " = "Notification "
    "Noti," = "Notification,"
    
    # Membresia -> Membership
    "MembresiaModule" = "MembershipModule"
    "MembresiaService" = "MembershipService"
    "MembresiaController" = "MembershipController"
    "MembresiaDto" = "MembershipDto"
    "from './membresia" = "from './membership"
    "from '../membresia" = "from '../membership"
    "from '../../modules/membresia" = "from '../../modules/membership"
    "from '../../../modules/membresia" = "from '../../../modules/membership"
    "membresia.service" = "membership.service"
    "membresia.controller" = "membership.controller"
    "membresia.entity" = "membership.entity"
    "membresia.dto" = "membership.dto"
    "Membresia " = "Membership "
    "Membresia," = "Membership,"
    
    # Pago -> Payment
    "PagoModule" = "PaymentModule"
    "PagoService" = "PaymentService"
    "PagoController" = "PaymentController"
    "PagoDto" = "PaymentDto"
    "CreatePagoDto" = "CreatePaymentDto"
    "UpdatePagoDto" = "UpdatePaymentDto"
    "from './pago" = "from './payment"
    "from '../pago" = "from '../payment"
    "from '../../modules/pago" = "from '../../modules/payment"
    "from '../../../modules/pago" = "from '../../../modules/payment"
    "pago.service" = "payment.service"
    "pago.controller" = "payment.controller"
    "pago.entity" = "payment.entity"
    "pago.dto" = "payment.dto"
    "Pago " = "Payment "
    "Pago," = "Payment,"
}

$totalUpdated = 0
Get-ChildItem -Path $srcPath -Filter "*.ts" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($old), $replacements[$old]
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $_.FullName -Value $content
        $totalUpdated++
        Write-Host "Updated: $($_.Name)"
    }
}

Write-Host "Total files updated: $totalUpdated"

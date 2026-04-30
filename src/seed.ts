import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { User } from './modules/users/entities/user.entity';
import { UserSeeder } from './database/seeding/seeds/users.seeder';
import { Notification } from './modules/notification/entities/notification.entity';
import { Review } from './modules/review/entities/review.entity';
import { Reservation } from './modules/reservation/entities/reservation.entity';
import { Membership } from './modules/membership/entities/membership.entity';
import { Payment } from './modules/payment/entities/payment.entity';
import { Court } from './modules/court/entities/court.entity';
import { Installation } from './modules/installation/entities/installation.entity';
import { ReservationSeeder } from './database/seeding/seeds/reservations.seeder';
import { CourtSeeder } from './database/seeding/seeds/court.seeder';
import { PaymentSeeder } from './database/seeding/seeds/payment.seeder';
import { MembershipSeeder } from './database/seeding/seeds/membership.seeder';
import { InstallationSeeder } from './database/seeding/seeds/installation.seeder';
import { ReviewSeeder } from './database/seeding/seeds/review.seeder';
import { NotificationSeeder } from './database/seeding/seeds/notification.seeder';
import { AuthTokenBlacklist } from './modules/auth/blacklist/auth_token_blacklist.entity';
import { CourtType } from './modules/court_type/entities/court_type.entity';
import { CourtTypeSeeder } from './database/seeding/seeds/court_type.seeder';

// To start with docker: docker exec -it respi-webserver npm run seed
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [
    User,
    Notification,
    Review,
    Reservation,
    Membership,
    Payment,
    Installation,
    CourtType,
    Court,
    AuthTokenBlacklist,
  ],
  seeds: [
    UserSeeder,
    InstallationSeeder,
    CourtTypeSeeder,
    CourtSeeder,
    MembershipSeeder,
    PaymentSeeder,
    ReviewSeeder,
    ReservationSeeder,
    NotificationSeeder,
  ],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(false);
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => console.log('Error initializing data source', error));

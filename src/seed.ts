import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { User } from "./modules/users/entities/user.entity";
import { UserSeeder } from "./database/seeding/seeds/users.seeder";
import { Noti } from "./modules/noti/entities/noti.entity";
import { Resenya } from "./modules/resenya/entities/resenya.entity";
import { Reserva } from "./modules/reserva/entities/reserva.entity";
import { Membresia } from "./modules/membresia/entities/membresia.entity";
import { Pago } from "./modules/pago/entities/pago.entity";
import { Pista } from "./modules/pista/entities/pista.entity";
import { Instalacion } from "./modules/instalacion/entities/instalacion.entity";
import { ReservaSeeder } from "./database/seeding/seeds/reservas.seeder";
import { PistaSeeder } from "./database/seeding/seeds/pista.seeder";
import { PagoSeeder } from "./database/seeding/seeds/pago.seeder";
import { MembresiaSeeder } from "./database/seeding/seeds/membresia.seeder";
import { InstalacionSeeder } from "./database/seeding/seeds/instalacion.seeder";
import { ResenyaSeeder } from "./database/seeding/seeds/resenya.seeder";
import { NotiSeeder } from "./database/seeding/seeds/noti.seeder";
import { AuthTokenBlacklist } from "./modules/auth/blacklist/auth_token_blacklist.entity";
import { TipoPista } from "./modules/tipo_pista/entities/tipo_pista.entity";
import { TipoPistaSeeder } from "./database/seeding/seeds/tipo_pista.seeder";

//para arrancar con docker: docker exec -it respi-webserver npm run seed
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [
    User,
    Noti,
    Resenya,
    Reserva,
    Membresia,
    Pago,
    Instalacion,
    TipoPista, 
    Pista,
    AuthTokenBlacklist,
    
  ],
  seeds: [
    UserSeeder,
    InstalacionSeeder,
    TipoPistaSeeder,
    PistaSeeder,
    MembresiaSeeder,
    ReservaSeeder,
    PagoSeeder,
    ResenyaSeeder,
    NotiSeeder
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


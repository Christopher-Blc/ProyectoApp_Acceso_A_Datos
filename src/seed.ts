import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { User } from "./modules/users/user.entity";
import { UserSeeder } from "./database/seeding/seeds/users.seeder";
import { Noti } from "./modules/noti/noti.entity";
import { Comentario } from "./modules/comentario/comentario.entity";
import { Reserva } from "./modules/reserva/reserva.entity";
import { Membresia } from "./modules/membresia/membresia.entity";
import { Pago } from "./modules/pago/pago.entity";
import { Pista } from "./modules/pista/pista.entity";
import { Instalacion } from "./modules/instalacion/instalacion.entity";
import { Horario_Pista } from "./modules/horario_pista/horario_pista.entity";
import { ReservaSeeder } from "./database/seeding/seeds/reservas.seeder";
import { pistaSeed } from "./database/seeding/seeds/pista.seeder";
import { PagoSeeder } from "./database/seeding/seeds/pago.seeder";
import { MembresiaSeeder } from "./database/seeding/seeds/membresia.seeder";
import { InstalacionSeeder } from "./database/seeding/seeds/instalacion.seeder";
import { ComentarioSeeder } from "./database/seeding/seeds/comentario.seeder";
import { Horario_PistaSeeder } from "./database/seeding/seeds/horario_pista.seeder";
import { NotiSeeder } from "./database/seeding/seeds/noti.seeder";
import { AuthTokenBlacklist } from "./modules/auth/auth-token-blacklist.entity";
import * as dotenv from 'dotenv';
dotenv.config();

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
    Comentario,
    Reserva,
    Membresia,
    Pago,
    Reserva,
    Instalacion,
    Pista,
    Horario_Pista,
    AuthTokenBlacklist,

  ],
  seeds: [
    UserSeeder,
    InstalacionSeeder,
    pistaSeed,
    MembresiaSeeder,
    Horario_PistaSeeder,
    ReservaSeeder,
    PagoSeeder,
    ComentarioSeeder,
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
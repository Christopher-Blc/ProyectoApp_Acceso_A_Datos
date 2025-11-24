import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { User } from "./users/user.entity";
import { UserSeeder } from "./db/seeding/seeds/users.seeder";
import { Noti } from "./noti/noti.entity";
import { Comentario } from "./comentario/comentario.entity";
import { Reserva } from "./reserva/reserva.entity";
import { Membresia } from "./membresia/membresia.entity";
import { Pago } from "./pago/pago.entity";
import { Pista } from "./pista/pista.entity";
import { Instalacion } from "./instalacion/instalacion.entity";
import { Horario_Pista } from "./horario_pista/horario_pista.entity";
import { ReservaSeeder } from "./db/seeding/seeds/reservas.seeder";
import { pistaSeed } from "./db/seeding/seeds/pista.seeder";
import { PagoSeeder } from "./db/seeding/seeds/pago.seeder";
import { MembresiaSeeder } from "./db/seeding/seeds/membresia.seeder";
import { InstalacionSeeder } from "./db/seeding/seeds/instalacion.seeder";
import { ComentarioSeeder } from "./db/seeding/seeds/comentario.seeder";
import { Horario_PistaSeeder } from "./db/seeding/seeds/horario_pista.seeder";
import { NotiSeeder } from "./db/seeding/seeds/noti.seeder";

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'respi',
  password: 'my-secret',
  database: 'respi',

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
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => console.log('Error initializing data source', error));
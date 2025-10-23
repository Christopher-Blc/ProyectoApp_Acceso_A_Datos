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


const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 2222,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'my-secret-pw',
  database: process.env.MYSQL_DATABASE || 'test',

  entities: [
    User,
    Noti,
    Comentario,
    Reserva,
    Membresia,
    Pago,
    Reserva,
    Pista,
    Instalacion,
    Horario_Pista,

  ],
  seeds: [
    UserSeeder,
    ReservaSeeder,
    pistaSeed
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
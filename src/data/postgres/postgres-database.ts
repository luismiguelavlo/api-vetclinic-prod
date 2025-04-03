import { DataSource } from 'typeorm';
import { User } from './models/user.model';
import { Pet } from './models/pet.model';
import { Doctor } from './models/doctor.model';
import { Specie } from './models/specie.model';
import { Appointment } from './models/appointment.model';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Clase para gestionar la conexión a una base de datos de postgresSQL utilizando TypeORM.
 *
 * @remarks
 * Esta clase congiura y administra la conexión a una base de datos, incluyendo la inicializacion de
 * las entidades: User, Pet, Doctor, Specie, y Appointment,
 *
 * La conexión se configura para sincronizar el esquema de la base de datos y utiliza SSL con
 * `rejectUnauthorized: false` para evitar errores en entornos de desarrollo
 *
 * @example
 * ```typescript
 * const database = new PostgresDatabase({
 *   host: "localhost",
 *   port: 5432,
 *   username: "postgres",
 *   password: "password",
 *   database: "veterinary",
 * });
 *
 * database.connect().then(() => {}).catch((error) => console.error(error));
 * ```
 */
export class PostgresDatabase {
  public datasource: DataSource;

  /**
   * Crea una nueva instancia de la conexión a PostgresSQL.
   *
   * @param options - Opciones de configuración para la conexión a la base de datos.
   */
  constructor(options: Options) {
    this.datasource = new DataSource({
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      synchronize: true,
      entities: [User, Pet, Doctor, Specie, Appointment],
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  /**
   * Inicializa la conexión a la base de datos.
   *
   * @remarks
   * Este método debe ser llamado para establecer la conexión a la base de datos.
   * y muestra un mensaje en consola si la conexión fue exitosa o no.
   *
   * @returns Una promesa que se resuelve cuando la conexión es exitosa y se rechaza si hay un error.
   */
  async connect() {
    try {
      await this.datasource.initialize();
      console.log('Connected to database 😊');
    } catch (error) {
      console.error(error);
    }
  }
}

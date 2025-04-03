import 'reflect-metadata';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { envs } from './config';
import { PostgresDatabase } from './data';

async function main() {
  const postgres = new PostgresDatabase({
    username: envs.DATABASE_USERNAME,
    password: envs.DATABASE_PASSWORD,
    host: envs.DATABASE_HOST,
    port: envs.DATABASE_PORT,
    database: envs.DATABASE_NAME,
  });

  await postgres.connect();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  await server.start();
}

main();

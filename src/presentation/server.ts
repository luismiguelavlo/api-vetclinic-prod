import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

/**
 * Interface representing the configuration options for the Express server.
 */
interface Options {
  port: number;
  routes: Router;
}
/**
 * Class representing an Express server.
 *
 * @example
 * ```ts
 * import { Server } from "./presentation/server";
 * import { AppRoutes } from "./presentation/routes";
 * const server = new Server({
 *  port: 4000,
 *  routes: AppRoutes.routes,
 * });
 * server.start();
 * ```
 */
export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  });

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  /**
   * Start the Express Server.
   *
   * @remarks
   * Este metodo debe ser llamado para ejecutar el servidor de express.
   */
  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(this.limiter);
    this.app.use(
      cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    this.app.use(helmet());
    this.app.use(hpp());

    this.app.use(this.routes);
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found',
      });
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port} 😒!`);
    });
  }
}

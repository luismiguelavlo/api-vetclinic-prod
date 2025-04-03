import { Router } from 'express';
import { DoctorController } from './controller';
import { CreatorDoctorService } from './services/creator-doctor.service';
import { FinderDoctorService } from './services/finder-doctors.service';
import { FinderUserService } from '../users/services/finder-user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { UserRole } from '../../data/postgres/models/user.model';

export class DoctorRoutes {
  static get routes(): Router {
    const router = Router();

    const finderUserService = new FinderUserService();
    const creatorDoctorService = new CreatorDoctorService(finderUserService);
    const finderDoctorService = new FinderDoctorService();

    const controller = new DoctorController(
      creatorDoctorService,
      finderDoctorService
    );

    router.use(AuthMiddleware.protect);
    router.get('/', controller.findAll);
    router.post(
      '/',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.create
    );

    return router;
  }
}

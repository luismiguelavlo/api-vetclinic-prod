import { Router } from 'express';
import { DoctorController } from './controller';
import { CreatorDoctorService } from './services/creator-doctor.service';
import { FinderDoctorsService } from './services/finder-doctors.service';
import { FinderUserService } from '../users/services/finder-user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { UserRole } from '../../data/postgres/models/user.model';
import { FinderDoctorService } from './services/finder-doctor.service';
import { UpdateDoctorService } from './services/update-doctor.service';
import { DeleteDoctorService } from './services/delete-doctor.service';

export class DoctorRoutes {
  static get routes(): Router {
    const router = Router();

    const finderUserService = new FinderUserService();
    const creatorDoctorService = new CreatorDoctorService(finderUserService);
    const finderDoctorsService = new FinderDoctorsService();
    const finderDoctorService = new FinderDoctorService();
    const updateDoctorService = new UpdateDoctorService();
    const deleteDoctorService = new DeleteDoctorService();

    const controller = new DoctorController(
      creatorDoctorService,
      finderDoctorsService,
      finderDoctorService,
      updateDoctorService,
      deleteDoctorService
    );

    router.get('/', controller.findAll);
    router.use(AuthMiddleware.protect);
    router.post(
      '/',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.create
    );
    router.get(
      '/:id',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.findOne
    );
    router.patch(
      '/:id',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.update
    );
    router.delete(
      '/:id',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.delete
    );

    return router;
  }
}

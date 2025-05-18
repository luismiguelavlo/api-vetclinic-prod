import { Router } from 'express';
import { CreatorAppointmentService } from './services/creator-appointment.service';
import { FinderPetService } from '../pets/services/finder-pet.service';
import { FinderDoctorService } from '../doctors/services/finder-doctor.service';
import { FinderAppointments } from './services/finder-appointments.service';
import { AppointmentController } from './controller';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { UpdateAppointmentService } from './services/update-appointment.service';
import { DeleteAppointmentService } from './services/delete-appointment.service';

export class AppointmentsRoute {
  static get routes(): Router {
    const router = Router();

    const finderPetService = new FinderPetService();
    const finderDoctorService = new FinderDoctorService();
    const creatorAppointment = new CreatorAppointmentService(
      finderPetService,
      finderDoctorService
    );
    const finderAppointment = new FinderAppointments();
    const updateAppointment = new UpdateAppointmentService(finderAppointment);
    const deleteAppointment = new DeleteAppointmentService(finderAppointment);

    const controller = new AppointmentController(
      creatorAppointment,
      finderAppointment,
      updateAppointment,
      deleteAppointment
    );

    router.use(AuthMiddleware.protect);
    router.post('/', controller.create);
    router.get('/', controller.findAppointmentByUserAuthenticated);
    router.get('/:id', controller.findOne);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.delete);
    router.get('/:term/:id', controller.findAll);

    return router;
  }
}

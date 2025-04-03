import { Router } from 'express';
import { CreatorAppointmentService } from './services/creator-appointment.service';
import { FinderPetService } from '../pets/services/finder-pet.service';
import { FinderDoctorService } from '../doctors/services/finder-doctor.service';
import { FinderAppointments } from './services/finder-appointments.service';
import { AppointmentController } from './controller';

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

    const controller = new AppointmentController(
      creatorAppointment,
      finderAppointment
    );

    router.post('/', controller.create);
    router.get('/:term/:id', controller.findAll);

    return router;
  }
}

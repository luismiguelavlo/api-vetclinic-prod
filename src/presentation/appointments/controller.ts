import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { CreatorAppointmentService } from './services/creator-appointment.service';
import { FinderAppointments } from './services/finder-appointments.service';
import { CreateAppointmentDto } from '../../domain/dtos/appointment/create-appointment.dto';

export class AppointmentController {
  constructor(
    private readonly creatorAppointment: CreatorAppointmentService,
    private readonly finderAppointment: FinderAppointments
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  create = (req: Request, res: Response) => {
    const [error, createAppointmentDto] = CreateAppointmentDto.execute(
      req.body
    );

    if (error) return res.status(422).json({ message: error });

    this.creatorAppointment
      .execute(createAppointmentDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  findAll = (req: Request, res: Response) => {
    const { term, id } = req.params;
    const { status = 'pending' } = req.query;
    console.log(req.query);

    this.finderAppointment
      .execute(term, id, status as string)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };
}

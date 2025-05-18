import { Request, Response } from 'express';
import { CustomError, UpdateAppointmentDto } from '../../domain';
import { CreatorAppointmentService } from './services/creator-appointment.service';
import { FinderAppointments } from './services/finder-appointments.service';
import { CreateAppointmentDto } from '../../domain/dtos/appointment/create-appointment.dto';
import { UpdateAppointmentService } from './services/update-appointment.service';
import { DeleteAppointmentService } from './services/delete-appointment.service';

export class AppointmentController {
  constructor(
    private readonly creatorAppointment: CreatorAppointmentService,
    private readonly finderAppointment: FinderAppointments,
    private readonly updateAppointment: UpdateAppointmentService,
    private readonly deleteAppointment: DeleteAppointmentService
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

  findAppointmentByUserAuthenticated = (req: Request, res: Response) => {
    const user = req.body.sessionUser;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    this.finderAppointment
      .executeByUserAuthenticated(user.id, limitNumber, offset)
      .then(({ appointments, total }) => {
        const totalPages = Math.ceil(total / limitNumber);
        res.status(200).json({
          data: appointments,
          meta: {
            currentPage: pageNumber,
            totalPages,
            totalRecords: total,
            recordsPerPage: limitNumber,
          },
        });
      })
      .catch((error) => this.handleError(error, res));
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body.sessionUser;

    this.finderAppointment
      .executeByAppointmentId(id, user.id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body.sessionUser;
    const [error, updateAppointmentDto] = UpdateAppointmentDto.execute(
      req.body
    );

    if (error) return res.status(422).json({ message: error });

    this.updateAppointment
      .execute(id, user.id, updateAppointmentDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body.sessionUser;

    this.deleteAppointment
      .execute(id, user.id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };
}

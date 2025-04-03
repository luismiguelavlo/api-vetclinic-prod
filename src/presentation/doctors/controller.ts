import { Request, Response } from 'express';
import { CreatorDoctorService } from './services/creator-doctor.service';
import { FinderDoctorService } from './services/finder-doctors.service';
import { CreateDoctorDto, CustomError } from '../../domain';

export class DoctorController {
  constructor(
    private creatorDoctorService: CreatorDoctorService,
    private finderDoctorsService: FinderDoctorService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  create = (req: Request, res: Response) => {
    const [error, createDoctorDto] = CreateDoctorDto.execute(req.body);

    if (error) return res.status(422).json({ message: error });

    this.creatorDoctorService
      .execute(createDoctorDto!)
      .then((msg) => res.status(201).json(msg))
      .catch((error) => this.handleError(error, res));
  };

  findAll = (req: Request, res: Response) => {
    this.finderDoctorsService
      .execute()
      .then((doctors) => res.status(200).json(doctors))
      .catch((error) => this.handleError(error, res));
  };
}

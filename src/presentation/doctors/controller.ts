import { Request, Response } from 'express';
import { CreatorDoctorService } from './services/creator-doctor.service';
import { FinderDoctorsService } from './services/finder-doctors.service';
import { CreateDoctorDto, CustomError, UpdateDoctorDto } from '../../domain';
import { FinderDoctorService } from './services/finder-doctor.service';
import { UpdateDoctorService } from './services/update-doctor.service';
import { DeleteDoctorService } from './services/delete-doctor.service';

export class DoctorController {
  constructor(
    private creatorDoctorService: CreatorDoctorService,
    private finderDoctorsService: FinderDoctorsService,
    private finderDoctorService: FinderDoctorService,
    private updateDoctorService: UpdateDoctorService,
    private deleteDoctorService: DeleteDoctorService
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
    const { limit = 10, page = 1 } = req.query;

    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const offset = (+pageNum - 1) * +limitNum;

    this.finderDoctorsService
      .execute(+limitNum, offset)
      .then(({ doctors, total }) =>
        res.status(200).json({
          data: doctors,
          meta: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / +limitNum),
            totalRecords: total,
            recordsPerPage: limitNum,
          },
        })
      )
      .catch((error) => this.handleError(error, res));
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderDoctorService
      .execute(id)
      .then((doctor) => res.status(200).json(doctor))
      .catch((error) => this.handleError(error, res));
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateDoctorDto] = UpdateDoctorDto.execute(req.body);

    if (error) return res.status(422).json({ message: error });

    this.updateDoctorService
      .execute(id, updateDoctorDto!)
      .then((doctor) => res.status(200).json(doctor))
      .catch((error) => this.handleError(error, res));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    this.deleteDoctorService
      .execute(id)
      .then((msg) => res.status(200).json(msg))
      .catch((error) => this.handleError(error, res));
  };
}

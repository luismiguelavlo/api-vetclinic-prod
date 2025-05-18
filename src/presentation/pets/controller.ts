import { Request, Response } from 'express';
import {
  CreatePetDto,
  CreateSpecieDto,
  CustomError,
  UpdatePetDto,
} from '../../domain';
import { FinderPetsService } from './services/finder-pets.service';
import { CreatorPetService } from './services/creator-pet.service';
import { FinderPetService } from './services/finder-pet.service';
import { UpdatePetService } from './services/update-pet.service';
import { DeletePetService } from './services/delete-pet.service';

export class PetController {
  constructor(
    private readonly finderPetsService: FinderPetsService,
    private readonly creatorPetService: CreatorPetService,
    private readonly finderPetService: FinderPetService,
    private readonly updatePetService: UpdatePetService,
    private readonly deletePetService: DeletePetService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  findAll = (req: Request, res: Response) => {
    const user = req.body.sessionUser;
    const { name = '', limit = 10, page = 1 } = req.query;

    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const offsetNum = (+pageNum - 1) * +limitNum;

    this.finderPetsService
      .execute(user.id, name as string, +limitNum, +offsetNum)
      .then(({ pets, totalPets }) => {
        const currentPage = pageNum;
        const totalPages = Math.ceil(totalPets / +limitNum);

        res.status(200).json({
          data: pets,
          meta: {
            currentPage,
            totalPages,
            totalRecords: totalPets,
            recordsPerPage: limitNum,
          },
        });
      })
      .catch((error) => this.handleError(error, res));
  };

  create = (req: Request, res: Response) => {
    const [error, createPetDto] = CreatePetDto.execute(req.body);
    const user = req.body.sessionUser;

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.creatorPetService
      .execute(createPetDto!, user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderPetService
      .execute(id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updatePetDto] = UpdatePetDto.execute(req.body);
    const user = req.body.sessionUser;

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.updatePetService
      .execute(id, user.id, updatePetDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body.sessionUser;

    this.deletePetService
      .execute(id, user.id)
      .then((data) => res.status(204).json())
      .catch((error) => this.handleError(error, res));
  };

  findAllByUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name = '', limit = 10, page = 1 } = req.query;

    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const offsetNum = (+pageNum - 1) * +limitNum;

    this.finderPetsService
      .execute(userId, name as string, +limitNum, +offsetNum)
      .then(({ pets, totalPets }) => {
        const currentPage = pageNum;
        const totalPages = Math.ceil(totalPets / +limitNum);

        res.status(200).json({
          data: pets,
          meta: {
            currentPage,
            totalPages,
            totalRecords: totalPets,
            recordsPerPage: limitNum,
          },
        });
      })
      .catch((error) => this.handleError(error, res));
  };
}

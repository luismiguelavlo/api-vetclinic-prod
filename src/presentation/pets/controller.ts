import { Request, Response } from 'express';
import { CreatePetDto, CreateSpecieDto, CustomError } from '../../domain';
import { FinderPetsService } from './services/finder-pets.service';
import { CreatorPetService } from './services/creator-pet.service';

export class PetController {
  constructor(
    private readonly finderPetService: FinderPetsService,
    private readonly creatorPetService: CreatorPetService
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

    this.finderPetService
      .execute(user.id)
      .then((data) => res.status(200).json(data))
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
}

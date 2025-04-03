import { Response, Request } from 'express';
import { CustomError } from '../../domain';
import { FinderSpeciesService } from './services/finder-species.service';
import { CreatorSpeciesService } from './services/creator-species.service';
import { CreateSpecieDto } from '../../domain/dtos/species/create-specie.dto';

export class SpeciesController {
  constructor(
    private readonly finderSpeciesService: FinderSpeciesService,
    private readonly creatorSpecieService: CreatorSpeciesService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  findAll = (req: Request, res: Response) => {
    this.finderSpeciesService
      .execute()
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  create = (req: Request, res: Response) => {
    const [error, specieData] = CreateSpecieDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.creatorSpecieService
      .execute(specieData!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}

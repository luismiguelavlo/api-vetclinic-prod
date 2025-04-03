import { Specie } from '../../../data/postgres/models/specie.model';
import { CustomError } from '../../../domain';

export class FinderSpecieService {
  async execute(specieId: string) {
    const specie = await Specie.findOne({
      where: {
        id: specieId,
      },
    });

    if (!specie) {
      throw CustomError.notFound('Specie not found');
    }

    return specie;
  }
}

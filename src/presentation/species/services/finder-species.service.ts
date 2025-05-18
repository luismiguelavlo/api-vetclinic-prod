import { Specie } from '../../../data/postgres/models/specie.model';
import { CustomError } from '../../../domain';

export class FinderSpeciesService {
  async execute(limit: number, offset: number) {
    try {
      const [species, total] = await Specie.findAndCount({
        take: limit,
        skip: offset,
        order: {
          name: 'ASC', // opcional: orden alfabético
        },
      });

      return { species, total };
    } catch (error) {
      throw CustomError.internalServer('Error finder species');
    }
  }
}

import { Specie } from '../../../data/postgres/models/specie.model';
import { CustomError } from '../../../domain';

export class FinderSpeciesService {
  async execute() {
    try {
      return await Specie.find();
    } catch (error) {
      throw CustomError.internalServer('Error finder species');
    }
  }
}

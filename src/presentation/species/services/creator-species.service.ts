import { Specie } from '../../../data/postgres/models/specie.model';
import { CustomError } from '../../../domain';
import { CreateSpecieDto } from '../../../domain/dtos/species/create-specie.dto';

export class CreatorSpeciesService {
  async execute(specieData: CreateSpecieDto) {
    const specie = new Specie();
    specie.name = specieData.name;

    try {
      await specie.save();
      return {
        message: 'Specie created sucessfully',
      };
    } catch (error) {
      this.throwException(error);
    }
  }

  private throwException(error: any) {
    if (error.code === '23505') {
      throw CustomError.conflict('specie already exist');
    }

    if (error.code === '22P02') {
      throw CustomError.unprocessableEntity('Invalid data type');
    }

    throw CustomError.internalServer('Error trying to create specie');
  }
}

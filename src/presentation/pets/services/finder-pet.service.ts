import { Pet } from '../../../data/postgres/models/pet.model';
import { User } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderPetService {
  async execute(petId: string) {
    const pet = await Pet.findOne({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      throw CustomError.notFound('Pet not found');
    }

    return pet;
  }
}

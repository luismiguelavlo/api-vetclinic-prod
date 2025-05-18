import { Pet } from '../../../data/postgres/models/pet.model';
import { CustomError } from '../../../domain';
import { FinderPetService } from './finder-pet.service';

export class DeletePetService {
  constructor(private readonly finderPetService: FinderPetService) {}

  async execute(petId: string, userId: string) {
    const pet = await this.finderPetService.execute(petId);

    if (pet.user.id !== userId) {
      throw CustomError.forbiden('Access Denied!');
    }

    pet.status = false;

    try {
      await pet.save();

      return pet;
    } catch (error) {
      throw CustomError.internalServer('Something went wrong');
    }
  }

  private async ensureOwner(pet: Pet, userId: string) {
    if (pet.user.id !== userId) {
      return false;
    }
    return true;
  }
}

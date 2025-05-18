import { Pet } from '../../../data/postgres/models/pet.model';
import { UserRole } from '../../../data/postgres/models/user.model';
import { CustomError, UpdatePetDto } from '../../../domain';
import { FinderUserService } from '../../users/services';
import { FinderPetService } from './finder-pet.service';

export class UpdatePetService {
  constructor(
    private readonly finderPetService: FinderPetService,
    private readonly finderUserService: FinderUserService
  ) {}

  async execute(petId: string, userId: string, updateData: UpdatePetDto) {
    const pet = await this.finderPetService.execute(petId);

    const hasAccess = await this.validateAccess(pet, userId);
    if (!hasAccess) {
      throw CustomError.forbiden('Access Denied');
    }

    pet.weight = updateData.weight;
    pet.name = updateData.name;
    pet.breed = updateData.breed;

    try {
      await pet.save();

      return {
        message: 'Pet updated sucessfully',
      };
    } catch (error: any) {
      throw CustomError.internalServer('Something went wrong');
    }
  }

  private async validateAccess(pet: Pet, userId: string) {
    const user = await this.finderUserService.execute(userId);
    if (user.rol !== UserRole.DOCTOR) {
      if (pet.user.id !== userId) {
        return false;
      }
    }
    return true;
  }
}

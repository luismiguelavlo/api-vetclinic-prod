import { Pet } from '../../../data/postgres/models/pet.model';
import { User } from '../../../data/postgres/models/user.model';
import { CreatePetDto, CustomError } from '../../../domain';
import { FinderSpecieService } from '../../species/services/finder-specie.service';

export class CreatorPetService {
  constructor(private readonly finderSpecieService: FinderSpecieService) {}

  async execute(petData: CreatePetDto, user: User) {
    const pet = new Pet();

    const specie = await this.finderSpecieService.execute(petData.specieId);

    pet.weight = petData.weight;
    pet.name = petData.name;
    pet.breed = petData.breed;
    pet.specie = specie;
    pet.user = user;

    try {
      await pet.save();
      return {
        message: 'Pet created succesfully',
      };
    } catch (error) {
      throw CustomError.internalServer('Error creating pet');
    }
  }
}

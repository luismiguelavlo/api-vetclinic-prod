import { Pet } from '../../../data/postgres/models/pet.model';
import { CustomError } from '../../../domain';

export class FinderPetService {
  async execute(petId: string) {
    const pet = await Pet.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('pet.specie', 'specie')
      .select([
        'pet',
        'user.id',
        'user.fullname',
        'user.email',
        'user.phone_number',
        'user.photo_url',
        'specie',
      ])
      .where('pet.id = :petId', { petId })
      .andWhere('pet.status = :status', { status: true })
      .getOne();

    if (!pet) {
      throw CustomError.notFound('Pet not found');
    }

    return pet;
  }
}

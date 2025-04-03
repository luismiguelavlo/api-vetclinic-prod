import { User } from '../../../data/postgres/models/user.model';

export class FinderPetsService {
  async execute(userId: string) {
    return await User.findOne({
      select: {
        id: true,
        fullname: true,
        email: true,
        pet: {
          id: true,
          breed: true,
          name: true,
          specie: {
            name: true,
          },
        },
      },
      where: {
        id: userId,
      },
      relations: ['pet', 'pet.specie'],
    });
  }
}

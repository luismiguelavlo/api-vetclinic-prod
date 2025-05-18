import { envs } from '../../../config';
import { Pet } from '../../../data/postgres/models/pet.model';
import { CustomError } from '../../../domain';

export class FinderPetsService {
  async execute(
    userId: string,
    name: string = '',
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      const query = Pet.createQueryBuilder('pet')
        .select(['pet.id', 'pet.name', 'pet.breed'])
        .where('pet.owner = :userId', { userId });

      // Si enviaron un nombre para buscar
      if (name && name.trim() !== '') {
        query.andWhere('pet.name ILIKE :name', { name: `%${name}%` });
      }

      // Paginación
      query.take(limit).skip(offset);

      // Ejecutar la búsqueda
      const pets = await query.getMany();

      // Obtener el total de mascotas que cumplen el filtro
      const totalPets = await query.getCount();

      return {
        pets,
        totalPets,
      };
    } catch (error) {
      if (envs.NODE_ENV === 'development') {
        console.error('Error al buscar mascotas:', error);
      }
      throw CustomError.internalServer('Error trying to find pets');
    }
  }

  executeByUserId() {}
}

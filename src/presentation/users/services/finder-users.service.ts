import { User } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderUsersService {
  async execute(
    rol: string,
    name: string = '',
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      // Inicializar el query
      const query = User.createQueryBuilder('user')
        .select([
          'user.id',
          'user.fullname',
          'user.email',
          'user.phone_number',
          'user.rol',
        ])
        .where('user.status = :status', { status: true });

      // Filtrar según el rol
      if (rol === 'doctor') {
        query.andWhere('user.rol = :role', { role: 'user' });
      } else if (rol === 'admin') {
        // No añadimos filtro de rol para admin
      }

      // Filtro por nombre si se envió el parámetro
      if (name && name !== '') {
        query.andWhere('user.fullname LIKE :name', { name: `%${name}%` });
      }

      // Paginación
      query.take(limit).skip(offset);

      // Ejecutar la consulta para obtener los usuarios
      const users = await query.getMany();

      // Obtener la cantidad total de usuarios con status true
      const totalUsers = await User.count({ where: { status: true } });

      return {
        users,
        totalUsers,
      };
    } catch (error) {
      throw CustomError.internalServer('Error trying to find users');
    }
  }
}

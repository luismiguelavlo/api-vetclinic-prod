import { Doctor } from '../../../data/postgres/models/doctor.model';
import { CustomError } from '../../../domain';

export class FinderDoctorService {
  async execute() {
    try {
      return Doctor.find({
        relations: ['user'],
        select: {
          user: {
            fullname: true,
            email: true,
            phone_number: true,
          },
        },
      });
    } catch (error: any) {
      throw CustomError.internalServer(error);
    }
  }
}

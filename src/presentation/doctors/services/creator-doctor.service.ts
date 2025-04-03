import { Doctor } from '../../../data/postgres/models/doctor.model';
import { CreateDoctorDto, CustomError } from '../../../domain';
import { FinderUserService } from '../../users/services/finder-user.service';

export class CreatorDoctorService {
  constructor(private readonly finderUserSerice: FinderUserService) {}

  async execute(createDoctorDto: CreateDoctorDto) {
    const doctor = new Doctor();

    const user = await this.finderUserSerice.execute(createDoctorDto.user_id);

    doctor.speciality = createDoctorDto.speciality;
    doctor.user = user;

    try {
      await doctor.save();
      return { message: 'User has been created!' };
    } catch (error: any) {
      throw CustomError.internalServer(error);
    }
  }
}

import { MedicalHistory } from '../../../data/postgres/models/medical-history.model';
import { Pet } from '../../../data/postgres/models/pet.model';
import { CustomError } from '../../../domain';

export class FinderMedicalHistoryService {
  // Método para obtener el historial médico de una mascota
  async execute(petId: string) {
    const pet = await this.ensurePetExists(petId);

    // Realizamos la consulta usando QueryBuilder para obtener el historial médico de la mascota
    const query = MedicalHistory.createQueryBuilder('medicalHistory')
      .leftJoinAndSelect('medicalHistory.pet', 'pet')
      .leftJoinAndSelect('medicalHistory.appointment', 'appointment')
      .where('medicalHistory.pet_id = :petId', { petId })
      .orderBy('medicalHistory.consultation_date', 'DESC'); // Ordenamos por fecha

    const medicalHistories = await query.getMany();

    return medicalHistories; // Si no hay, se retorna un arreglo vacío
  }

  // Método para obtener un historial médico por su ID
  async executeByMedicalHistoryId(medicalHistoryId: string) {
    const query = MedicalHistory.createQueryBuilder('medicalHistory')
      .leftJoinAndSelect('medicalHistory.pet', 'pet')
      .leftJoinAndSelect('medicalHistory.appointment', 'appointment')
      .where('medicalHistory.id = :medicalHistoryId', { medicalHistoryId });

    const medicalHistory = await query.getOne();

    if (!medicalHistory) {
      throw CustomError.notFound('Medical history not found');
    }

    return medicalHistory;
  }

  // Validación para asegurar que la mascota exista y esté activa
  private async ensurePetExists(petId: string): Promise<Pet> {
    const pet = await Pet.findOne({
      where: { id: petId },
    });

    if (!pet) {
      throw CustomError.badRequest('Pet not found');
    }

    if (!pet.status) {
      throw CustomError.badRequest('Pet is inactive');
    }

    return pet;
  }
}

import PdfPrinter from 'pdfmake';
import { MedicalHistory } from '../../../data/postgres/models/medical-history.model';
import { Pet } from '../../../data/postgres/models/pet.model';
import { Appointment } from '../../../data/postgres/models/appointment.model';
import { CustomError } from '../../../domain';

const fonts = {
  Roboto: {
    normal: __dirname + '/../../../config/fonts/Roboto-Regular.ttf',
    bold: __dirname + '/../../../config/fonts/Roboto-Bold.ttf',
    italics: __dirname + '/../../../config/fonts/Roboto-Italic.ttf',
    bolditalics: __dirname + '/../../../config/fonts/Roboto-SemiBoldItalic.ttf',
  },
};

const printer = new PdfPrinter(fonts);

export class GenerateMedicalHistoryPdfService {
  async execute(medicalHistoryId: string) {
    const medicalHistory = await this.getMedicalHistory(medicalHistoryId);
    const pet = medicalHistory.pet;
    const appointment = medicalHistory.appointment;

    const docDefinition = this.createPdfTemplate(
      medicalHistory,
      pet,
      appointment
    );

    const pdfDoc = printer.createPdfKitDocument(docDefinition as any);

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err) => reject(err));
      pdfDoc.end();
    });
  }

  // Obtener la historia clínica junto con la mascota y la cita
  private async getMedicalHistory(medicalHistoryId: string) {
    const medicalHistory = await MedicalHistory.findOne({
      where: { id: medicalHistoryId },
      relations: ['pet', 'appointment'],
    });

    if (!medicalHistory) {
      throw CustomError.notFound('Medical history not found');
    }

    return medicalHistory;
  }

  // Crear el template del PDF
  private createPdfTemplate(
    medicalHistory: MedicalHistory,
    pet: Pet,
    appointment: Appointment
  ) {
    return {
      content: [
        { text: 'Historia Clínica', style: 'header' },
        this.createClinicInfo(),
        this.createAppointmentInfo(appointment),
        this.createPetInfo(pet),
        this.createMedicalHistoryInfo(medicalHistory),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        clinicInfo: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 5],
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          margin: [0, 10],
        },
        normalText: {
          fontSize: 12,
        },
      },
    };
  }

  private createClinicInfo() {
    return [
      { text: 'VetCare Clínica Veterinaria', style: 'clinicInfo' },
      {
        text: 'Dirección: Calle Ficticia 123, Ciudad Imaginaria',
        style: 'clinicInfo',
      },
      { text: 'Teléfono: +1 (123) 456-7890', style: 'clinicInfo' },
      { text: 'Correo: contacto@vetcare.com', style: 'clinicInfo' },
    ];
  }

  private createAppointmentInfo(appointment: Appointment) {
    return [
      { text: 'Información de la Cita', style: 'sectionTitle' },
      { text: `Razón: ${appointment.reason}`, style: 'normalText' },
      {
        text: `Fecha: ${appointment.date.toLocaleString()}`,
        style: 'normalText',
      },
      { text: `Estado: ${appointment.status}`, style: 'normalText' },
    ];
  }

  private createPetInfo(pet: Pet) {
    return [
      { text: 'Información de la Mascota', style: 'sectionTitle' },
      { text: `Nombre: ${pet.name}`, style: 'normalText' },
      { text: `Raza: ${pet.breed}`, style: 'normalText' },
      { text: `Peso: ${pet.weight} kg`, style: 'normalText' },
    ];
  }

  private createMedicalHistoryInfo(medicalHistory: MedicalHistory) {
    return [
      { text: 'Historial Médico', style: 'sectionTitle' },
      { text: `Síntomas: ${medicalHistory.symptoms}`, style: 'normalText' },
      { text: `Diagnóstico: ${medicalHistory.diagnosis}`, style: 'normalText' },
      { text: `Tratamiento: ${medicalHistory.treatment}`, style: 'normalText' },
      {
        text: `Medicación: ${medicalHistory.medications}`,
        style: 'normalText',
      },
      {
        text: `Recomendaciones: ${medicalHistory.recommendations}`,
        style: 'normalText',
      },
    ];
  }
}

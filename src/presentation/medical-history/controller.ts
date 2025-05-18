import { Request, Response } from 'express';
import { CreateMedicalHistoryDto, CustomError } from '../../domain';
import { FinderMedicalHistoryService } from './services/finder-medical-history.service';
import { CreatorMedicalHistoryService } from './services/create-medical-history.service';
import { GenerateMedicalHistoryPdfService } from './services/generate-medical-history-pdf.service';

export class MedicalHistoryController {
  constructor(
    private readonly finderMedicalHistoryService: FinderMedicalHistoryService,
    private readonly creatorMedicalHistoryService: CreatorMedicalHistoryService,
    private readonly generateMedicalHistoryPdfService: GenerateMedicalHistoryPdfService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  // Método para encontrar todas las historias clínicas de una mascota
  findAll = (req: Request, res: Response) => {
    const { petId } = req.params;

    this.finderMedicalHistoryService
      .execute(petId)
      .then((data) => {
        if (data.length === 0) {
          return res
            .status(404)
            .json({ message: 'No medical histories found' });
        }
        return res.status(200).json(data);
      })
      .catch((error) => this.handleError(error, res));
  };

  // Método para encontrar una historia clínica específica por su ID
  findOne = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderMedicalHistoryService
      .executeByMedicalHistoryId(id)
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: 'Medical history not found' });
        }
        return res.status(200).json(data);
      })
      .catch((error) => this.handleError(error, res));
  };

  // Método para crear una historia clínica
  create = (req: Request, res: Response) => {
    const [error, createMedicalHistoryDto] = CreateMedicalHistoryDto.execute(
      req.body
    );

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.creatorMedicalHistoryService
      .execute(createMedicalHistoryDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  generatePdf = (req: Request, res: Response) => {
    const { medicalHistoryId } = req.params;

    this.generateMedicalHistoryPdfService
      .execute(medicalHistoryId)
      .then((pdfBuffer) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="historia_clinica_${medicalHistoryId}.pdf"`
        );
        res.send(pdfBuffer);
      })
      .catch((error) => this.handleError(error, res));
  };
}

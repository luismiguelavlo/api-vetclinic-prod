import { Router } from 'express';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { FinderMedicalHistoryService } from './services/finder-medical-history.service';
import { CreatorMedicalHistoryService } from './services/create-medical-history.service';
import { GenerateMedicalHistoryPdfService } from './services/generate-medical-history-pdf.service';
import { MedicalHistoryController } from './controller';

export class MedicalHistoryRoutes {
  static get routes(): Router {
    const router = Router();

    const finderMedicalHistoryService = new FinderMedicalHistoryService();
    const creatorMedicalHistoryService = new CreatorMedicalHistoryService();
    const generateMedicalHistoryPdfService =
      new GenerateMedicalHistoryPdfService();
    const controller = new MedicalHistoryController(
      finderMedicalHistoryService,
      creatorMedicalHistoryService,
      generateMedicalHistoryPdfService
    );

    router.use(AuthMiddleware.protect);
    router.get('/:id', controller.findOne);
    router.get('/pet/:petId', controller.findAll);
    router.post('/', controller.create);
    router.get('/pdf/:medicalHistoryId', controller.generatePdf);

    return router;
  }
}

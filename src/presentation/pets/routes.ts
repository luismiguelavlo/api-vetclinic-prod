import { Router } from 'express';
import { CreatorPetService } from './services/creator-pet.service';
import { FinderPetsService } from './services/finder-pets.service';
import { PetController } from './controller';
import { FinderSpecieService } from '../species/services/finder-specie.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

export class PetRoutes {
  static get routes(): Router {
    const router = Router();

    const finderSpecieService = new FinderSpecieService();
    const creatorPetService = new CreatorPetService(finderSpecieService);
    const finderPetsService = new FinderPetsService();

    const controller = new PetController(finderPetsService, creatorPetService);

    router.use(AuthMiddleware.protect);
    router.get('/', controller.findAll);
    router.post('/', controller.create);

    return router;
  }
}

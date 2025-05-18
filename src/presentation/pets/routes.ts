import { Router } from 'express';
import { CreatorPetService } from './services/creator-pet.service';
import { FinderPetsService } from './services/finder-pets.service';
import { PetController } from './controller';
import { FinderSpecieService } from '../species/services/finder-specie.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { FinderPetService } from './services/finder-pet.service';
import { UpdatePetService } from './services/update-pet.service';
import { DeletePetService } from './services/delete-pet.service';
import { UserRole } from '../../data/postgres/models/user.model';
import { FinderUserService } from '../users/services';

export class PetRoutes {
  static get routes(): Router {
    const router = Router();

    const finderUserService = new FinderUserService();
    const finderSpecieService = new FinderSpecieService();
    const creatorPetService = new CreatorPetService(finderSpecieService);
    const finderPetsService = new FinderPetsService();
    const finderPetService = new FinderPetService();
    const updatePetService = new UpdatePetService(
      finderPetService,
      finderUserService
    );
    const deletePetService = new DeletePetService(finderPetService);

    const controller = new PetController(
      finderPetsService,
      creatorPetService,
      finderPetService,
      updatePetService,
      deletePetService
    );

    router.use(AuthMiddleware.protect);
    router.get('/', controller.findAll);
    router.get(
      '/user/:userId',
      AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.DOCTOR),
      controller.findAllByUser
    );
    router.post('/', controller.create);
    router.get('/:id', controller.findOne);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
  }
}

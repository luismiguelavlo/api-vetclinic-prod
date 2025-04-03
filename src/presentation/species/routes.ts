import { Router } from 'express';
import { CreatorSpeciesService } from './services/creator-species.service';
import { FinderSpeciesService } from './services/finder-species.service';
import { SpeciesController } from './controller';

export class SpeciesRoutes {
  static get routes(): Router {
    const router = Router();

    const creatorSpecieService = new CreatorSpeciesService();
    const finderSpecieService = new FinderSpeciesService();

    const controller = new SpeciesController(
      finderSpecieService,
      creatorSpecieService
    );

    router.get('/', controller.findAll);
    router.post('/', controller.create);

    return router;
  }
}

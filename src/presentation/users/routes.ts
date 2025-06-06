import { Request, Response, Router } from 'express';
import { UserController } from './controller';
import { FinderUsersService } from './services/finder-users.service';
import { RegisterUserService } from './services/register-user.service';
import { FinderUserService } from './services/finder-user.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { LoginUserService } from './services/login-user.service';
import { EmailService } from '../common/services/email.service';
import { envs } from '../../config';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { User, UserRole } from '../../data/postgres/models/user.model';
import { UpdatePasswordService } from './services/update-password.service';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_MAIL
    );

    const finderUsers = new FinderUsersService();
    const registerUser = new RegisterUserService(emailService);
    const finderUser = new FinderUserService();
    const updateUser = new UpdateUserService();
    const deleteUser = new DeleteUserService();
    const loginUser = new LoginUserService();
    const updatePassword = new UpdatePasswordService();

    const controller = new UserController(
      registerUser,
      finderUsers,
      finderUser,
      updateUser,
      deleteUser,
      loginUser,
      updatePassword
    );

    router.post('/register', controller.register);
    router.post('/login', controller.login);
    router.get('/validate-account/:token', controller.validateAccount);
    router.use(AuthMiddleware.protect);
    router.get('/me', controller.findMyInfo);
    router.get(
      '/',
      AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.DOCTOR),
      controller.findAll
    );
    router.get(
      '/:id',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.findOne
    );
    router.patch('/password', controller.updatePassword);
    router.patch('/:id', controller.update);
    router.delete(
      '/:id',
      AuthMiddleware.restrictTo(UserRole.ADMIN),
      controller.delete
    );

    return router;
  }
}

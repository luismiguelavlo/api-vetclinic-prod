import { Request, Response } from 'express';

import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from '../../domain';
import { LoginUserService } from './services/login-user.service';
import { envs } from '../../config';
import {
  DeleteUserService,
  FinderUserService,
  FinderUsersService,
  RegisterUserService,
  UpdateUserService,
} from './services';
import { UpdatePasswordService } from './services/update-password.service';

export class UserController {
  constructor(
    private readonly registerUser: RegisterUserService,
    private readonly finderUsers: FinderUsersService,
    private readonly finderUser: FinderUserService,
    private readonly updateUser: UpdateUserService,
    private readonly deleteUser: DeleteUserService,
    private readonly loginUser: LoginUserService,
    private readonly updatePasswordService: UpdatePasswordService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Something went very wrong🧨' });
  };

  findAll = (req: Request, res: Response) => {
    const { name = '', limit = 10, page = 1 } = req.query; // Usamos "page" en lugar de "offset"
    const user = req.body.sessionUser;

    if (page && isNaN(Number(page))) {
      return res.status(422).json({ message: 'Page must be a number' });
    }

    if (limit && isNaN(Number(limit))) {
      return res.status(422).json({ message: 'Limit must be a number' });
    }

    if (page && +page === 0) {
      return res.status(422).json({ message: 'Page must be greater than 0' });
    }

    // Convertir limit y page a números si no son strings
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;

    // Calcular el offset
    const offsetNum = (+pageNum - 1) * +limitNum;

    this.finderUsers
      .execute(user.role, name as string, +limitNum, +offsetNum)
      .then(({ users, totalUsers }) => {
        // Calcular la página actual y el total de páginas
        const currentPage = pageNum;
        const totalPages = Math.ceil(totalUsers / +limitNum);

        // Responder con los usuarios y la información de la paginación
        res.status(200).json({
          data: users,
          meta: {
            currentPage,
            totalPages,
            totalRecords: totalUsers,
            recordsPerPage: limitNum,
          },
        });
      })
      .catch((err) => this.handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.registerUser
      .execute(registerUserDto!)
      .then((message) => res.status(201).json(message))
      .catch((err) => this.handleError(err, res));
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderUser
      .execute(id)
      .then((user) => res.status(200).json(user))
      .catch((err) => this.handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body.sessionUser;
    const [error, updateUserDto] = UpdateUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.updateUser
      .execute(id, user.id, updateUserDto!)
      .then((user) => res.status(200).json(user))
      .catch((err) => this.handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    this.deleteUser
      .execute(id)
      .then(() => res.status(204).json(null))
      .catch((err) => this.handleError(err, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.execute(req.body);
    if (error) {
      return res.status(422).json({ message: error });
    }

    this.loginUser
      .execute(loginUserDto!)
      .then((data) => {
        res.cookie('token', data.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 3 * 60 * 60 * 1000,
        });

        return res.status(200).json(data);
      })
      .catch((err) => this.handleError(err, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    this.registerUser
      .validateAccount(token)
      .then(() => res.send('Email validated sucessfully'))
      .catch((err) => this.handleError(err, res));
  };

  findMyInfo = (req: Request, res: Response) => {
    const { id, fullname, email, role, photo_url, phone_number } =
      req.body.sessionUser;
    res.status(200).json({
      id,
      fullname,
      email,
      role,
      photo_url,
      phone_number,
    });
  };

  updatePassword = (req: Request, res: Response) => {
    const { id } = req.body.sessionUser;
    const [error, passwordsDto] = UpdatePasswordDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.updatePasswordService
      .execute(id, passwordsDto!)
      .then(() => {
        res.status(200).json({ message: 'Password updated successfully' });
      })
      .catch((err) => {
        this.handleError(err, res);
      });
  };
}

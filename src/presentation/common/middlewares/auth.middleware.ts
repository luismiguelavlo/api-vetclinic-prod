import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config';
import { User, UserRole } from '../../../data/postgres/models/user.model';

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    // Try to get token from cookies first
    let token = req.cookies.token;

    // If no token in cookies, try to get it from Authorization header
    if (!token) {
      const authorization = req.header('Authorization');

      if (!authorization)
        return res.status(401).json({ message: 'No token provided' });

      if (!authorization.startsWith('Bearer '))
        return res.status(401).json({ message: 'Invalid Token' });

      token = authorization.split(' ').at(1) || '';
    }

    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: 'Invalid Token' });

      const user = await User.findOne({
        where: {
          id: payload.id,
          status: true,
        },
      });
      if (!user) return res.status(401).json({ message: 'Invalid user' });

      req.body.sessionUser = user;
      req.setTimeout(5000); // Set request timeout to 5 seconds
      res.setTimeout(5000);
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'internal server error...' });
    }
  }

  static restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.body.sessionUser.rol)) {
        return res
          .status(403)
          .json({ message: 'You are not authorizated to access this route' });
      }
      next();
    };
  };
}

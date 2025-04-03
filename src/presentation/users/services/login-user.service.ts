import { encriptAdapter, envs, JwtAdapter } from '../../../config';
import { User } from '../../../data/postgres/models/user.model';
import { CustomError, LoginUserDto } from '../../../domain';

export class LoginUserService {
  async execute(credentials: LoginUserDto) {
    //1. Check if the user exists
    const user = await this.ensureUserExists(credentials.email);
    //2. Check if the password is correct
    this.ensurePasswordIsCorrect(credentials.password, user!.password);
    //3. Generate a token
    const token = await this.generateToken(
      { id: user!.id },
      envs.JWT_EXPIRE_IN
    );
    //4. Return the token
    return {
      token,
      user: {
        id: user?.id,
        email: user?.email,
        phone: user?.phone_number,
        rol: user?.rol,
      },
    };
  }

  private ensureUserExists(email: string) {
    const user = User.findOne({
      where: {
        email: email,
        status: true,
      },
    });

    if (!user) {
      throw CustomError.notFound('User not found');
    }

    return user;
  }

  private ensurePasswordIsCorrect(
    unHashedPassword: string,
    hashedPassword: string
  ) {
    const isMatch = encriptAdapter.compare(unHashedPassword, hashedPassword);

    if (!isMatch) {
      throw CustomError.unAutorized('Invalid credentials');
    }
  }

  private async generateToken(payload: any, duration: string) {
    const token = await JwtAdapter.generateToken(payload, duration);
    if (!token) throw CustomError.internalServer('Error while creating JWT');
    return token;
  }
}

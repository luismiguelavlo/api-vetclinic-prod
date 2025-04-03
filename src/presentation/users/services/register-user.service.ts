import { encriptAdapter, envs, JwtAdapter } from '../../../config';
import { User } from '../../../data/postgres/models/user.model';
import { CustomError, RegisterUserDto } from '../../../domain';
import { EmailService } from '../../common/services/email.service';

export class RegisterUserService {
  constructor(private readonly emailService: EmailService) {}

  async execute(userData: RegisterUserDto) {
    const user = new User();

    user.fullname = userData.fullname;
    user.email = userData.email;
    user.password = this.encriptPassword(userData.password);
    user.phone_number = userData.phone_number;

    try {
      await user.save();
      //this.sendLinkToEmailForValidateAccount(userData.email);
      return {
        message: 'User created successfully',
      };
    } catch (error: any) {
      this.throwException(error);
    }
  }

  private findOneUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer('Email not registered in db');
    return user;
  };

  public validateAccount = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest('Invalid Token');

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not found in token');

    const user = await this.findOneUserByEmail(email);

    user.status = true;

    try {
      await user.save();

      return {
        message: 'User activated',
      };
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong');
    }
  };

  private sendLinkToEmailForValidateAccount = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, '300s');
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `http://${envs.WEBSERVICE_URL}/api/users/validate-account/${token}`;
    const html = `
      <h1>Validate Your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const isSent = this.emailService.sendEmail({
      to: email,
      subject: 'Validate your account',
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };

  private throwException(error: any) {
    if (error.code === '23505') {
      throw CustomError.conflict('Email already in use');
    }

    if (error.code === '22P02') {
      throw CustomError.unprocessableEntity('Invalid data type');
    }

    throw CustomError.internalServer('Error trying to create user');
  }

  private encriptPassword(password: string): string {
    return encriptAdapter.hash(password);
  }
}

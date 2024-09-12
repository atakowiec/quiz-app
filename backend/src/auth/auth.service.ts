import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.model";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { Request } from "../app";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./auth";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {
    // empty
  }

  async register(createUserDto: RegisterDto, res: Response) {
    // first find if the user already exists
    const user = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    // below is detecting which field is causing the conflict
    const conflictErrors = [];
    if (user?.username === createUserDto.username) {
      conflictErrors.push({
        field: "username",
        error: "The username is already taken",
      });
    }

    if (user?.email === createUserDto.email) {
      conflictErrors.push({
        field: "email",
        error: "The email is already taken",
      });
    }

    // if there are any conflicts, throw an exception
    if (conflictErrors.length > 0) {
      throw new ConflictException(conflictErrors);
    }

    // if no conflicts, create the user
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await this.hashPassword(createUserDto.password),
      permission: 0,
    });

    // save the user
    await this.userRepository.save(newUser);

    // then create jwt and set cookie
    const token = await this.createJwt(newUser);
    this.appendTokenToResponse(res, token);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      permission: newUser.permission,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async createJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ id: user.id } as TokenPayload);
  }

  public appendTokenToResponse(res: Response, token: string) {
    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      httpOnly: true,
      secure: false,
    });
  }

  public clearTokenFromResponse(res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
    });
  }

  extractTokenFromRequest(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  extractPayloadFromToken(token: string): TokenPayload {
    return this.jwtService.decode(token) as TokenPayload;
  }

  public extractTokenPayloadFromRequest(req: Request): TokenPayload {
    return this.extractPayloadFromToken(this.extractTokenFromRequest(req));
  }
}

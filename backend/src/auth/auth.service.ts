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
import { LoginDto } from "./dto/login.dto";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { UserPacket } from "@shared/user";
import { SocketType } from "src/game/game.types";
import { parse } from "cookie";
import { GameService } from "../game/services/game.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly gameService: GameService,
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
        error: "Nazwa użytkownika jest już zajęta",
      });
    }

    if (user?.email === createUserDto.email) {
      conflictErrors.push({
        field: "email",
        error: "Email jest już zajęty",
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

  async login(loginDto: LoginDto, res: Response): Promise<UserPacket> {
    // find the user
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    // if the user doesn't exist, throw an exception
    if (!user) {
      throw new UnauthorizedException("Niepoprawne dane logowania");
    }

    // compare passwords
    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Niepoprawne dane logowania");
    }

    // create jwt and set cookie
    const token = await this.createJwt(user);
    this.appendTokenToResponse(res, token);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      permission: user.permission,
    };
  }

  public logout(res: Response) {
    this.clearTokenFromResponse(res);
    return {}; // I guess I have to return something here
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

  public async createJwt(user: TokenPayload): Promise<string> {
    const tokenPayload: TokenPayload = {
      id: user.id,
      username: user.username,
    };

    return this.jwtService.signAsync(tokenPayload);
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

  public clearTokenFromSocket(socket: SocketType) {
    socket.handshake.headers.cookie = "";
  }

  public extractTokenFromRequest(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  public extractPayloadFromToken(token: string): TokenPayload {
    return this.jwtService.verify(token);
  }

  public extractTokenPayloadFromRequest(req: Request): TokenPayload {
    return this.extractPayloadFromToken(this.extractTokenFromRequest(req));
  }

  public extractTokenPayloadFromSocket(socket: SocketType): TokenPayload {
    const token = parse(socket.handshake.headers.cookie).access_token;
    return this.extractPayloadFromToken(token);
  }

  async verify(req: Request) {
    if (!req.user?.username) {
      return {}
    }

    if (this.gameService.isUsernameConnected(req.user.username)) {
      this.clearTokenFromResponse(req.res);
      throw new ConflictException("Użytkownik jest już połączony");
    }

    // regenerate token when user is verified
    this.appendTokenToResponse(req.res, await this.createJwt(req.user));

    return req.user;
  }

  async setNickname(username: string, request: Request, Response: Response) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    // TODO: tu wywala bład za drugim razem jak wyślemy, nie patrzyłem jeszcze dlaczego
    // if (user || this.gameService.isUsernameConnected(username)) {
    //   throw new ConflictException("Nazwa użytkownika jest już zajęta");
    // }

    const tokenPayload: TokenPayload = { username };
    const token = await this.jwtService.signAsync(tokenPayload);
    this.appendTokenToResponse(Response, token);

    return tokenPayload && { access_token: token };
  }
}

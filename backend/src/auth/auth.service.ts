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

    const conflictErrors = [];
    // first check if the user is already connected to the game
    if (this.gameService.isUsernameConnected(createUserDto.username)) {
      conflictErrors.push({
        field: "username",
        error: "Gracz z tą nazwą jest już połączony",
      });
    }

    // below is detecting which field is causing the conflict
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

    if (this.gameService.isUsernameConnected(user.username)) {
      throw new ConflictException("Użytkownik jest już połączony");
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

  async verify(req: Request) {
    if (!req.user?.username) {
      return {};
    }

    if (this.gameService.isUsernameConnected(req.user.username)) {
      this.clearTokenFromResponse(req.res);
      throw new ConflictException("Użytkownik jest już połączony");
    }

    // if user is not logged check if the username has a game to reconnect - if not, clear nickname from the token
    if (!req.user.id) {
      const game = this.gameService.getGameByUsername(req.user.username);
      if (!game) {
        this.clearTokenFromResponse(req.res);

        return {};
      }
    }

    // regenerate token when user is verified
    this.appendTokenToResponse(req.res, await this.createJwt(req.user));

    return req.user;
  }

  async setUsername(username: string, response: Response) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (user) {
      throw new ConflictException("Nazwa użytkownika jest już zajęta");
    }

    if (this.gameService.isUsernameConnected(username)) {
      throw new ConflictException("Gracz z tą nazwą jest już połączony");
    }

    const tokenPayload: TokenPayload = { username };
    const token = await this.jwtService.signAsync(tokenPayload);
    this.appendTokenToResponse(response, token);

    return {
      username: username,
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
}

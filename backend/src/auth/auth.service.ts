import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password + process.env.JWT_SECRET).digest("hex");
  }

  async register(email: string, password: string, fullName: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException("Email already registered");

    const user = await this.prisma.user.create({
      data: { email, password: this.hashPassword(password), full_name: fullName },
    });

    return this.signToken(user.id, user.email, user.full_name);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== this.hashPassword(password)) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.signToken(user.id, user.email, user.full_name);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const { password: _, ...profile } = user;
    return profile;
  }

  private signToken(userId: string, email: string, fullName: string) {
    const payload = { sub: userId, email, full_name: fullName };
    return {
      access_token: this.jwt.sign(payload),
      user: { id: userId, email, full_name: fullName },
    };
  }
}

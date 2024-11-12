/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async generateToken(user: any) {
        const payload = { username: user.username, _id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

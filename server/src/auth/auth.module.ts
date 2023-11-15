import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Controller } from './auth42/auth42.controller';
import { Auth42Service } from './auth42/auth42.service';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth42/auth42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/model/user/user.module';

@Module({
	imports: [
		UserModule,
		PassportModule.register({ defaultStrategy: '42' }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (ConfigService: ConfigService) => {
				return {
					global: true,
					secret: ConfigService.get<string>('JWT_SECRET'),
					signOptions: { expiresIn: '1d' },
				}
			},
		}),
	],	
	providers: [AuthService, Auth42Service, FortyTwoStrategy],
	controllers: [Auth42Controller]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Controller } from './auth42/auth42.controller';
import { Auth42Service } from './auth42/auth42.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth42/auth42.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ModelUserModule } from 'src/model/user/user.module';
import { ModelUser42Module } from 'src/model/user42/user42.module';

@Module({
	imports: [
		ModelUserModule,
		ModelUser42Module,
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
	providers: [AuthService, Auth42Service, FortyTwoStrategy, JwtService],
	controllers: [Auth42Controller],
	exports: [AuthService, Auth42Service, FortyTwoStrategy, JwtService],
})
export class AuthModule {}

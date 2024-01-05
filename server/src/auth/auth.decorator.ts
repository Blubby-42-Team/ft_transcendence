import { UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserAuthTokenDto } from "./auth.class";

export const UserAuthTOkentPayload = createParamDecorator((_, request: any) => {
	const httpRequest = request?.switchToHttp()?.getRequest();
	const token = getAuthorizationToken(httpRequest);

	const secret = process.env.JWT_SECRET;

	const jwt = new JwtService({
		secret: secret,
	});

	try {
		const payload: UserAuthTokenDto = jwt.verify(token);
		return payload;
	} catch (error) {
		throw new UnauthorizedException('Invalid jwt signature');
	}
});

function getAuthorizationToken(req: any): string {
	try {
		return req?.cookies['user_auth'];
	} catch (error) {
		throw new UnauthorizedException('No token provided');
	}
}

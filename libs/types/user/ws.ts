import { IsDefined, IsEnum, IsNumber, Min } from "class-validator";
import { UserTelemetryStatus } from "./user";

export class UserTelemetryStatusWsDto {
	@IsDefined()
	@IsEnum(UserTelemetryStatus)
	status: UserTelemetryStatus;
};

export class GetUserStatusOfWsDto {
	@IsNumber()
	@Min(1)
	id: number;
}
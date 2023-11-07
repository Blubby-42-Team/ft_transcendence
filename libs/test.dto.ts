import { IsNotEmpty, IsDefined, IsEmail, IsOptional} from 'class-validator'

export class TestDto {
	@IsNotEmpty()
	@IsDefined()
	id: number;

	@IsEmail()
	@IsOptional()
	mail: string;
}
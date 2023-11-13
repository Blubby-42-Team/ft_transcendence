import { IsNotEmpty, IsDefined, IsEmail, IsOptional, IsNumber, IsPositive} from 'class-validator'

export class TestDto {
	@IsNotEmpty()
	@IsDefined()
	@IsNumber()
	@IsPositive()
	id: number;

	@IsEmail()
	@IsOptional()
	mail: string;
}
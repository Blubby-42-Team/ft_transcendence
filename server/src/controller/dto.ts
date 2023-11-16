import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsInt, IsJSON, IsNotEmpty, IsString, Max, Min } from "class-validator";

type Constructor<T = {}> = new (...args: any[]) => T;

const id = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		id: number;
	}

	return _;
}

const employee = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		employee: number;
	}

	return _;
}

const name = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		name: string;
	}

	return _;
}

const email = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		@IsEmail()
		email: string;
	}

	return _;
}

const team = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		team: number;
	}

	return _;
}

const task = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		task: number;
	}

	return _;
}

const number = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		number: number;
	}

	return _;
}

const value = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		value: string;
	}

	return _;
}

const category = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsJSON()

		// check if json is in format of CategoryInput
		category: string;
	}

	return _;
}

const weight = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		weight: number;
	}

	return _;
}

const time = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		time: number;
	}

	return _;
}

const estimatedTime = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		estimatedTime: number;
	}

	return _;
}

const priority = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		priority: string;
	}

	return _;
}

const description = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		description: string;
	}

	return _;
}

const type = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		type: number;
	}

	return _;
}

const token = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@IsString()
		authorisation_token: string;
	}

	return _;
}

const expertise = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		@Max(3)
		expertise: number;
	}

	return _;
}

const event = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		event: number;
	}

	return _;
}

const pourcentage = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(0)
		@Max(100)
		pourcentage: number;
	}

	return _;
}

const group = <TBase extends Constructor>(Base: TBase = class {} as TBase) => {
	class _ extends Base {
		@IsDefined()
		@IsNotEmpty()
		@Type(() => Number)
		@IsInt()
		@Min(1)
		group: number;
	}

	return _;
}

export default {
	id,
	employee,
	name,
	email,
	team,
	task,
	number,
	value,
	category,
	weight,
	time,
	estimatedTime,
	priority,
	description,
	type,
	token,
	expertise,
	event,
	pourcentage,
	group,
}
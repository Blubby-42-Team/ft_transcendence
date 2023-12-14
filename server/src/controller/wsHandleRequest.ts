import { BadGatewayException, BadRequestException, HttpException, Logger } from "@nestjs/common";
import { AcknowledgmentWsDto } from "@shared/dto/ws.dto";
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

const logger = new Logger("wsHandleRequest");

export async function handleRequest<InputDTO extends object, OutputType>(
	req: any,
	dtoClass: new () => InputDTO,
	callback: (data: InputDTO) => Promise<OutputType>
): Promise<AcknowledgmentWsDto<OutputType>> {
	try {

		logger.debug(req);

		if (!req) {
			throw new BadRequestException('empty payload');
		}

		if (typeof req !== 'object') {
			throw new BadRequestException(`invalid payload type: ${typeof req}, expected json`);
		}

		const dto = plainToInstance(dtoClass, req);
		await validateOrReject(dto)
		.catch(errors => {
			logger.debug(`validation error: ${errors}`)
			throw errors.map(error => Object.values(error.constraints)).join(', ');
		});

		const res = await callback(dto);
		return new AcknowledgmentWsDto<OutputType>('ok', res);

	} catch (error) {

		logger.error(error);

		// Check if the error is a HttpException
		if (error instanceof HttpException) {
			return new AcknowledgmentWsDto<any>('error', error?.message ?? 'unknown error, check logs');
		}

		return new AcknowledgmentWsDto<any>('error', error);
	}
}


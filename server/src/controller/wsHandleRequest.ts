import { BadGatewayException, BadRequestException, Logger } from "@nestjs/common";
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

		const dto = plainToInstance(dtoClass, req);
		await validateOrReject(dto)
		.catch(errors => {
			throw errors.map(error => Object.values(error.constraints)).join(', ');
		});

		const res = await callback(dto);
		return new AcknowledgmentWsDto<OutputType>('ok', res);

	} catch (error) {

		logger.error(error);
		return new AcknowledgmentWsDto('error', error);
	}
}


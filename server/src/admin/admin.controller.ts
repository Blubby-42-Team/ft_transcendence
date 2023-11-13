/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Redirect, Get} from '@nestjs/common';

@Controller('admin')
export class AdminController {
	
	@Get('ws')
	@Redirect('https://admin.socket.io/')
	redirectToAdminSocket() {}

}

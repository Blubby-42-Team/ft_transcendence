import { ModelMuteService } from './mute.service';
import { PostgresMuteModule } from 'src/service/postgres/mute/mute.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';

@Module({
	imports: [PostgresMuteModule,PostgresUserModule],
	providers: [ModelMuteService],
	exports: [ModelMuteService]
})
export class ModelMuteModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './presentation/questions/questions.module';

@Module({
  imports: [QuestionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

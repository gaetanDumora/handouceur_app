import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './configs/config.interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { globalAgent } from 'https';

async function bootstrap() {
  const certsDir = resolve(__dirname, '../../certs/');
  globalAgent.options.ca = readFileSync(certsDir + '/ca-cert.pem', 'utf-8');

  const httpsOptions = {
    key: readFileSync(certsDir + '/server-key.pem', 'utf-8'),
    cert: readFileSync(certsDir + '/server-cert.pem', 'utf-8'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.setGlobalPrefix('api/v1');

  const config = app.get(ConfigService<EnvironmentVariables>);
  const port = config.get('PORT');

  await app.listen(port);
}
bootstrap();

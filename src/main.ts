import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔓 Habilita CORS para o front Angular
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // ✅ Validação global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Prefixo global da API
  app.setGlobalPrefix('api');

  // 📘 Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API Livros')
    .setDescription('Documentação da API de Livros')
    .setVersion('1.0')
    .addTag('livros')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 📚 Swagger disponível em http://localhost:3001/docs
  SwaggerModule.setup('docs', app, document);

  // ⚙️ Porta (use 3001 pra não conflitar com o Angular)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📄 Swagger docs on http://localhost:${port}/docs`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança
  app.use(helmet({
    contentSecurityPolicy: false, // Desabilitar para desenvolvimento
  }));

  // Compressão
  app.use(compression({
    level: 6,
    threshold: 1024,
  }));

  // CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('msgSYSTEC API')
      .setDescription('API para sistema de autenticação Google e leitura de planilhas')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      memory: process.memoryUsage(),
    });
  });

  // Graceful shutdown
  const prismaService = app.get(PrismaService);
  await prismaService.$connect();

  process.on('beforeExit', async () => {
    await prismaService.$disconnect();
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});

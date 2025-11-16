import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { BoardsModule } from '../../src/boards/boards.module';
import mongoose from 'mongoose';

describe('Boards (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(mongoUri),
        BoardsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('/boards (POST)', () => {
    it('should create a new board', () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({
          title: 'Test Board',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.title).toBe('Test Board');
          expect(res.body.description).toBe('Test Description');
        });
    });

    it('should return 400 if title is missing', () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({
          description: 'Test Description',
        })
        .expect(400);
    });
  });

  describe('/boards (GET)', () => {
    it('should return an array of boards', async () => {
      await request(app.getHttpServer()).post('/boards').send({
        title: 'Test Board',
        description: 'Test Description',
      });

      return request(app.getHttpServer())
        .get('/boards')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/boards/:id (GET)', () => {
    it('should return a board by id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/boards')
        .send({
          title: 'Test Board',
          description: 'Test Description',
        });

      const boardId = createRes.body._id;

      return request(app.getHttpServer())
        .get(`/boards/${boardId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(boardId);
          expect(res.body.title).toBe('Test Board');
        });
    });

    it('should return 404 if board not found', () => {
      return request(app.getHttpServer())
        .get('/boards/507f1f77bcf86cd799439011')
        .expect(404);
    });
  });

  describe('/boards/:id (PUT)', () => {
    it('should update a board', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/boards')
        .send({
          title: 'Test Board',
          description: 'Test Description',
        });

      const boardId = createRes.body._id;

      return request(app.getHttpServer())
        .put(`/boards/${boardId}`)
        .send({
          title: 'Updated Board',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Board');
        });
    });
  });

  describe('/boards/:id (DELETE)', () => {
    it('should delete a board', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/boards')
        .send({
          title: 'Test Board',
          description: 'Test Description',
        });

      const boardId = createRes.body._id;

      await request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .expect(200);

      return request(app.getHttpServer()).get(`/boards/${boardId}`).expect(404);
    });
  });
});

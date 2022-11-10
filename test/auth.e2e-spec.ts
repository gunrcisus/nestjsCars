import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const email = 'gunr@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email , password:'1234'})
      .expect(201)
      .then((res)=>{
        const {id ,email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);

      });
  });

  it('should get the current logged in user after signup', async() => {
    const email = 'gunr121@test.com';
    const res = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({ email , password:'1234'})
    .expect(201);

    const cookie = res.get('Set-Cookie');
   
   const {body} = await request(app.getHttpServer())
    .get('/auth/whoami')
    .set('Cookie', cookie)
    .expect(200)

    expect(body.email).toEqual(email);
  });
});

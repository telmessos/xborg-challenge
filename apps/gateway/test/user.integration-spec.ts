import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { SiweService } from '../src/siwe/siwe.service';

describe('User Integration (Gateway <-> API)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;

  // Dummy SIWE message/signature for test (replace with valid if needed)
  const message = 'test-message';
  const signature = 'test-signature';

  // Helper to generate a unique userName for each test run
  function generateUniqueUserName() {
    return 'integrationUser_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
  }
  let userName: string;

  // Helper to generate a unique address for each test run
  function generateUniqueAddress() {
    // Just for test purposes, not a real Ethereum address
    return '0x' + Math.random().toString(16).substring(2, 10).padEnd(40, '0');
  }
  let address: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // Mock SIWE verification to always succeed
    const siweService = app.get(SiweService);
    userName = generateUniqueUserName();
    address = generateUniqueAddress();
    jest.spyOn(siweService, 'verifyMessage').mockImplementation(async (message, signature) => ({
      domain: 'test',
      address,
      statement: 'test',
      uri: 'http://localhost',
      version: '1',
      chainId: 1,
      nonce: 'test',
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      notBefore: new Date().toISOString(),
      requestId: 'test',
      resources: [],
    } as any));
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fail to get user profile without token', async () => {
    await request(server)
      .get('/user')
      .expect(401);
  });

  it('should signup a new user', async () => {
    const res = await request(server)
      .post('/user/signup')
      .send({ message, signature, userName })
      .expect(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should login with the same user', async () => {
    const res = await request(server)
      .post('/user/login')
      .send({ message, signature })
      .expect(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should get user profile with valid token', async () => {
    const res = await request(server)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('userName', userName);
  });
}); 
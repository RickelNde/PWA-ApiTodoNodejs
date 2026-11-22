import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/server';

const idInconnu = '00000000-0000-4000-8000-000000000000';

const alice = request.agent(app);
const admin = request.agent(app);

before(async () => {
  await alice
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', passeWord: 'motdepasse123' })
    .expect(200);

  await admin
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', passeWord: 'motdepasse123' })
    .expect(200);
});

describe('GET /api/bedrooms', () => {
  it('retourne 200 et une liste quand connecté', async () => {
    const response = await alice.get('/api/bedrooms').expect(200);
    assert.ok(Array.isArray(response.body));
  });

  it('retourne 401 sans connexion', async () => {
    await request(app).get('/api/bedrooms').expect(401);
  });
});

describe('GET /api/bedroom/:id', () => {
  it('retourne 404 si la chambre est introuvable', async () => {
    await alice.get(`/api/bedroom/${idInconnu}`)
    .expect(404);
  });
});

describe('POST /api/bedroom', () => {
  it('retourne 403 pour un user (réservé aux admins)', async () => {
    await alice.post('/api/bedroom')
    .send({ bedroomsNumber: 101 }).expect(403);
  });

  it('retourne 400 si des champs obligatoires manquent (admin)', async () => {
    await admin.post('/api/bedroom')
    .send({ bedroomsNumber: 101 }).expect(400);
  });
});

describe('PATCH /api/bedroom/:id', () => {
  it('retourne 403 pour un user (réservé aux admins)', async () => {
    await alice.patch(`/api/bedroom/${idInconnu}`).
    send({ bedroomsNumber: 150 }).expect(403);
  });

  it('retourne 404 si la chambre est introuvable (admin)', async () => {
    await admin.patch(`/api/bedroom/${idInconnu}`)
    .send({ bedroomsNumber: 150 }).expect(404);
  });
});
import { describe, it,before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/server'; // super test démarre le serveur pour nous par magie! (<3)

const session = request.agent(app);


before(async () => {
  await session
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', passeWord: 'motdepasse123' })
    .expect(200);
});
describe('PATCH /api/todo/:id', () => {
  it('retourne 404 si le todo est introuvable', async () => {
    const response = await request(app)
      .patch('/api/todo/00000000-0000-4000-8000-000000000000')
      .send({ text: 'Nouveau texte', isCompleted: true })
      .expect(404);

    assert.equal(response.body.error, 'Todo not found');
  });
});
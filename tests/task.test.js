const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('./setup');
const { User, Task } = require('../src/models');

let token;
let userId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });

  // Create a user and get token for authenticated requests
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@test.com', password: 'password123' });

  token = res.body.token;
  userId = res.body.user.id;
});

const authHeader = () => `Bearer ${token}`;

describe('Task API', () => {
  const validTask = {
    title: 'Test Task',
    description: 'A test task description',
    status: 'todo',
  };

  // ==================== CREATE ====================

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(validTask.title);
      expect(res.body.description).toBe(validTask.description);
      expect(res.body.status).toBe('todo');
      expect(res.body.userId).toBe(userId);
    });

    it('should fail without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
    });

    it('should fail with invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send({ title: 'Task', status: 'invalid' });

      expect(res.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send(validTask);

      expect(res.status).toBe(401);
    });
  });

  // ==================== GET ALL ====================

  describe('GET /api/tasks', () => {
    it('should return all tasks for the user', async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send({ title: 'Task 1' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send({ title: 'Task 2' });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', authHeader());

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should return empty array when no tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', authHeader());

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('should not return tasks from another user', async () => {
      // Create a task for user 1
      await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send({ title: 'User 1 Task' });

      // Register user 2
      const user2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 2', email: 'user2@test.com', password: 'password123' });

      // Get tasks for user 2
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user2.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  // ==================== GET BY ID ====================

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const res = await request(app)
        .get(`/api/tasks/${created.body.id}`)
        .set('Authorization', authHeader());

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(validTask.title);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/tasks/99999')
        .set('Authorization', authHeader());

      expect(res.status).toBe(404);
    });

    it('should not allow access to another user task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const user2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 2', email: 'user2@test.com', password: 'password123' });

      const res = await request(app)
        .get(`/api/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${user2.body.token}`);

      expect(res.status).toBe(404);
    });
  });

  // ==================== UPDATE ====================

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const res = await request(app)
        .put(`/api/tasks/${created.body.id}`)
        .set('Authorization', authHeader())
        .send({ title: 'Updated Title', status: 'done' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.status).toBe('done');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/99999')
        .set('Authorization', authHeader())
        .send({ title: 'Nope' });

      expect(res.status).toBe(404);
    });

    it('should not allow updating another user task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const user2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 2', email: 'user2@test.com', password: 'password123' });

      const res = await request(app)
        .put(`/api/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${user2.body.token}`)
        .send({ title: 'Hacked' });

      expect(res.status).toBe(404);
    });
  });

  // ==================== DELETE ====================

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const res = await request(app)
        .delete(`/api/tasks/${created.body.id}`)
        .set('Authorization', authHeader());

      expect(res.status).toBe(204);

      // Verify it's gone
      const check = await request(app)
        .get(`/api/tasks/${created.body.id}`)
        .set('Authorization', authHeader());

      expect(check.status).toBe(404);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/99999')
        .set('Authorization', authHeader());

      expect(res.status).toBe(404);
    });

    it('should not allow deleting another user task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', authHeader())
        .send(validTask);

      const user2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 2', email: 'user2@test.com', password: 'password123' });

      const res = await request(app)
        .delete(`/api/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${user2.body.token}`);

      expect(res.status).toBe(404);
    });
  });
});

/**
* @jest-environment node
*/
import mongoose from 'mongoose';
import supertest from 'supertest';
import { UserAuth, UserPublic } from '../src/types';

const server = require('../src/server');

const request = supertest('http://localhost:3000');

describe('Application Endpoint tests', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe('POST /signup - Sign up to the system (username, password)', () => {
    it('Signup User', async done => {
      const response = await request.post('/signup').send({
        username: 'username',
        password: 'password',
      });

      expect(response.status).toBe(200);
      done();
    });

    it('Signup User (User Already Exist)', async done => {
      await request.post('/signup').send({
        username: 'username',
        password: 'password',
      });

      const response = await request.post('/signup').send({
        username: 'username',
        password: 'password',
      });

      expect(response.status).toBe(409);
      done();
    });

    it('Signup User (Missing parameter)', async done => {
      const response = await request.post('/signup').send({
        username: 'user',
      });

      expect(response.status).toBe(400);
      done();
    });
  });

  describe('POST /login - Logs in an existing user with a password', () => {
    it('Login User', async done => {
      await request.post('/signup').send({
        username: 'userName',
        password: '123123',
      });

      const response = await request.post('/login').send({
        username: 'userName',
        password: '123123',
      });

      expect(response.status).toBe(200);
      done();
    });

    it('Login User (Missing Parameters)', async done => {
      const response = await request.post('/login').send({
        username: 'userName',
      });

      expect(response.status).toBe(400);
      done();
    });

    it('Login User (Wrong password)', async done => {
      await request.post('/signup').send({
        username: 'userName',
        password: '123123',
      });

      const response = await request.post('/login').send({
        username: 'userName',
        password: '121212',
      });

      expect(response.status).toBe(401);
      done();
    });
  });

  describe('GET /me - Get the currently logged in user information', () => {
    it('Get Me', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });

      const { token: userToken } = exportUserAuthData(signupResponse);

      const response = await request.get('/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Get Me (Bad token)', async done => {
      const response = await request.get('/me')
        .set('Authorization', 'Bearer zz');

      expect(response.status).toBe(401);
      done();
    });

    it('Get Me (No token)', async done => {
      const response = await request.get('/me');

      expect(response.status).toBe(401);
      done();
    });
  });

  describe('PUT /me/update-password - Update the current users password', () => {
    it('Update Password', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });

      const { token: userToken } = exportUserAuthData(signupResponse);

      const response = await request.put('/me/update-password')
        .send({ password: 'password' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Update Password (Bad token)', async done => {
      const response = await request.put('/me/update-password')
        .send({ password: 'password' })
        .set('Authorization', 'Bearer zz');

      expect(response.status).toBe(401);
      done();
    });

    it('Update Password (No token)', async done => {
      const response = await request.put('/me/update-password');

      expect(response.status).toBe(401);
      done();
    });
  });

  describe('GET /user/:id/ - List username & number of likes of a user', () => {
    it('Get User By Id', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });
      const { id: userId } = exportUserAuthData(signupResponse);
      const response = await request.get(`/user/${userId}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Get User By Id (User Not Found)', async done => {
      const response = await request.get('/user/1');

      expect(response.status).toBe(404);
      done();
    });
  });

  describe('PUT /user/:id/like - Like a user', () => {
    it('Like User', async done => {
      const user1SignupResponse = await request.post('/signup').send({
        username: 'user233',
        password: '123123',
      });

      const { token: user1Token } = exportUserAuthData(user1SignupResponse);

      const user2SignupResponse = await request.post('/signup').send({
        username: 'user123',
        password: '123123',
      });

      const { id: user2Id } = exportUserAuthData(user2SignupResponse);
      const response = await request.put(`/user/${user2Id}/like`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Like User (User Not Found)', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user1223',
        password: '123123',
      });

      const { token: userToken } = exportUserAuthData(signupResponse);

      const response = await request.put('/user/userId/like')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      done();
    });
  });

  describe('PUT /user/:id/unlike - Un-Like a user', () => {
    it('Unlike User', async done => {
      const user1SignupResponse = await request.post('/signup').send({
        username: 'user233',
        password: '123123',
      });

      const { token: user1Token } = exportUserAuthData(user1SignupResponse);

      const user2SignupResponse = await request.post('/signup').send({
        username: 'user123',
        password: '123123',
      });

      const { id: user2Id } = exportUserAuthData(user2SignupResponse);

      const response = await request.put(`/user/${user2Id}/unlike`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Unlike User (Not Authorized)', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user123',
        password: '123123',
      });

      const { id: userId } = exportUserAuthData(signupResponse);

      const response = await request.put(`/user/${userId}/unlike`)
        .set('Authorization', 'Bearer zz');

      expect(response.status).toBe(401);
      done();
    });

    it('Unlike User (User Not Found)', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user1223',
        password: '123123',
      });

      const { token: userToken } = exportUserAuthData(signupResponse);

      const response = await request.put('/user/userId/unlike')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      done();
    });
  });

  describe('/most-liked - List users in a most liked to least liked', () => {
    it('Get most liked', async done => {
      const user1SignupResponse = await request.post('/signup').send({
        username: 'user233',
        password: '123123',
      });

      const { token: user1Token, id: user1Id } = exportUserAuthData(user1SignupResponse);

      const user2SignupResponse = await request.post('/signup').send({
        username: 'user123',
        password: '123123',
      });

      const { token: user2Token, id: user2Id } = exportUserAuthData(user2SignupResponse);

      await request.put(`/user/${user2Id}/like`)
        .set('Authorization', `Bearer ${user1Token}`);

      await request.put(`/user/${user2Id}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      await request.put(`/user/${user1Id}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      const response = await request.get('/most-liked');

      const mostLikedResponseData = response.text;
      const mostLikedResponseBody = JSON.parse(mostLikedResponseData);

      const { users } = mostLikedResponseBody;

      expect(response.status).toBe(200);
      expect(users.length).toBe(2);
      expect(users[0].id).toBe(user2Id);
      done();
    });
  });

  // Helpers
  function exportUserAuthData(response):UserAuth {
    const responseData = response.text;
    const responseBody = JSON.parse(responseData);
    return responseBody;
  }
});

/**
* @jest-environment node
*/
import mongoose from 'mongoose';
import supertest from 'supertest';
import * as http from 'http';

import { UserAuth } from '../src/types';
import { MONGO_URL } from '../src/constants';
import Application from '../src/application';

describe('Application Endpoint tests', () => {
  const request = supertest(http.createServer(Application.instance));

  beforeAll(async () => {
    await mongoose.connect(MONGO_URL);
  });

  afterEach(async done => {
    await mongoose.connection.dropDatabase();
    done();
  });

  describe('POST /signup - Sign up to the system (username, password)', () => {
    it('Signup User', async done => {
      const username = 'username';
      const password = 'password';

      // user signup
      const response = await request.post('/signup').send({ username, password });

      const { username: signupUsername } = extractUserAuthData(response);

      expect(response.status).toBe(200);
      expect(signupUsername).toBe(username);
      done();
    });

    it('Signup User (User Already Exist)', async done => {
      const username = 'username';
      const password = 'password';

      // user sign up
      await request.post('/signup').send({ username, password });

      const response = await request.post('/signup').send({ username, password });

      expect(response.status).toBe(409);
      expect(extractErrorMessage(response)).toBe('User with that username already exists.');
      done();
    });

    it('Signup User (Missing parameter)', async done => {
      const response = await request.post('/signup').send({ username: 'user' });

      expect(response.status).toBe(400);
      expect(extractErrorMessage(response)).toBe('User should provide username and password.');
      done();
    });
  });

  describe('POST /login - Logs in an existing user with a password', () => {
    it('Login User', async done => {
      const username = 'username';
      const password = 'password';

      await request.post('/signup').send({ username, password });

      const response = await request.post('/login').send({ username, password });

      const { username: loginUsername } = extractUserAuthData(response);

      expect(response.status).toBe(200);
      expect(loginUsername).toBe(username);
      done();
    });

    it('Login User (Missing Parameters)', async done => {
      const response = await request.post('/login').send({ username: 'username' });

      expect(response.status).toBe(400);
      expect(extractErrorMessage(response)).toBe('User should provide username and password.');
      done();
    });

    it('Login User (Wrong password)', async done => {
      const username = 'username';

      // create new user
      await request.post('/signup').send({ username, password: 'password' });

      // user tries login with wrong password
      const response = await request.post('/login').send({ username, password: 'wrong_password' });

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('Username and password mismatch.');
      done();
    });
  });

  describe('GET /me - Get the currently logged in user information', () => {
    it('Get Me', async done => {
      // user needs to have a token
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });

      const { token: userToken } = extractUserAuthData(signupResponse);

      const response = await request.get('/me')
        .set('Auth', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Get Me (Bad token)', async done => {
      const response = await request.get('/me')
        .set('Auth', 'Bearer zz');

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('Token is not valid.');
      done();
    });

    it('Get Me (No token)', async done => {
      const response = await request.get('/me');

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('User should provide token.');
      done();
    });
  });

  describe('PUT /me/update-password - Update the current users password', () => {
    it('Update Password', async done => {
      // user needs to have a token
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });

      const { token: userToken } = extractUserAuthData(signupResponse);

      const response = await request.put('/me/update-password')
        .send({ password: 'password' })
        .set('Auth', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Update Password (Bad token)', async done => {
      const response = await request.put('/me/update-password')
        .send({ password: 'password' })
        .set('Auth', 'Bearer zz');

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('Token is not valid.');
      done();
    });

    it('Update Password (No token)', async done => {
      const response = await request.put('/me/update-password');

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('User should provide token.');
      done();
    });
  });

  describe('GET /user/:id/ - List username & number of likes of a user', () => {
    it('Get User By Id', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user23',
        password: '123123',
      });
      const { id: userId } = extractUserAuthData(signupResponse);
      const response = await request.get(`/user/${userId}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Get User By Id (User Not Found)', async done => {
      const response = await request.get('/user/1');

      expect(response.status).toBe(404);
      expect(extractErrorMessage(response)).toBe('User not found.');
      done();
    });
  });

  describe('PUT /user/:id/like - Like a user', () => {
    it('Like User', async done => {
      // get token for user1
      const user1SignupResponse = await request.post('/signup').send({
        username: 'user233',
        password: '123123',
      });

      const { token: user1Token } = extractUserAuthData(user1SignupResponse);

      // get id for user2
      const user2SignupResponse = await request.post('/signup').send({
        username: 'user123',
        password: '123123',
      });

      const { id: user2Id } = extractUserAuthData(user2SignupResponse);
      const response = await request.put(`/user/${user2Id}/like`)
        .set('Auth', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Like User (User Not Found)', async done => {
      const signupResponse = await request.post('/signup').send({
        username: 'user1223',
        password: '123123',
      });

      const { token: userToken } = extractUserAuthData(signupResponse);

      const response = await request.put('/user/userId/like')
        .set('Auth', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(extractErrorMessage(response)).toBe('User not found.');
      done();
    });
  });

  describe('PUT /user/:id/unlike - Un-Like a user', () => {
    it('Unlike User', async done => {
      // create user1 and get token
      const user1SignupResponse = await request.post('/signup').send({ username: 'user233', password: '123123' });

      const { token: user1Token } = extractUserAuthData(user1SignupResponse);

      // create user2 and get id
      const user2SignupResponse = await request.post('/signup').send({ username: 'user123', password: '123123' });

      const { id: user2Id } = extractUserAuthData(user2SignupResponse);

      const response = await request.put(`/user/${user2Id}/unlike`)
        .set('Auth', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      done();
    });

    it('Unlike User (Not Authorized)', async done => {
      // create user and getId
      const signupResponse = await request.post('/signup').send({ username: 'user123', password: '123123' });

      const { id: userId } = extractUserAuthData(signupResponse);

      // <<< NOTE: Use wrong token
      const response = await request.put(`/user/${userId}/unlike`)
        .set('Auth', 'Bearer zz');

      expect(response.status).toBe(401);
      expect(extractErrorMessage(response)).toBe('Token is not valid.');
      done();
    });

    it('Unlike User (User Not Found)', async done => {
      // create user and get token
      const signupResponse = await request.post('/signup').send({ username: 'user1223', password: '123123' });
      const { token: userToken } = extractUserAuthData(signupResponse);

      const response = await request.put('/user/userId/unlike')
        .set('Auth', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(extractErrorMessage(response)).toBe('User not found.');
      done();
    });
  });

  describe('GET /most-liked - List users in a most liked to least liked', () => {
    it('Get most liked', async done => {
      // Create two users and get their ids and tokens
      const user1SignupResponse = await request.post('/signup').send({ username: 'user233', password: '123123' });
      const { token: user1Token, id: user1Id } = extractUserAuthData(user1SignupResponse);

      const user2SignupResponse = await request.post('/signup').send({ username: 'user123', password: '123123' });
      const { token: user2Token, id: user2Id } = extractUserAuthData(user2SignupResponse);

      // User1 likes user2
      await request.put(`/user/${user2Id}/like`)
        .set('Auth', `Bearer ${user1Token}`);

      // User2 likes user2
      await request.put(`/user/${user2Id}/like`)
        .set('Auth', `Bearer ${user2Token}`);

      // User2 likes user1
      await request.put(`/user/${user1Id}/like`)
        .set('Auth', `Bearer ${user2Token}`);

      const response = await request.get('/most-liked');

      const mostLikedResponseData = response.text;
      const mostLikedResponseBody = JSON.parse(mostLikedResponseData);

      const { users } = mostLikedResponseBody;

      expect(response.status).toBe(200);
      expect(users.length).toBe(2);
      expect(users[0].id).toBe(user2Id);
      expect(users[0].likes).toBe(2);
      done();
    });
  });

  // Helpers
  function extractUserAuthData(response): UserAuth {
    const responseData = response.text;
    const responseBody = JSON.parse(responseData);
    return responseBody;
  }

  function extractErrorMessage(response): string {
    const responseData = response.text;
    const responseBody = JSON.parse(responseData);
    return responseBody.message;
  }
});

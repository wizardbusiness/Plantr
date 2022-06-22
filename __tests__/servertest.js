const supertest = require('supertest');
const fs = require('fs');

const server = 'http://localhost:3000';

describe('backend main page', () => {
  describe('GET', () => {
    it ('responds with 200 OK status and text/html content type', () => {
      return supertest(server)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200);
    })
  });
})

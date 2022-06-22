const supertest = require('supertest');
const fs = require('fs');

const server = 'http://localhost:3000';

describe('backend main page', () => {
  // Receive
  describe('GET', () => {
    it ('responds with 200 OK status and json content on body of response', () => {
      return supertest(server)
        .get('/')
        .expect('Content-Type', /application\/json/)
        .expect(200);
    })

    it ('delivers current plants on body of response');
    
  });
  // Create
  describe('POST', () => {
    it ('sends data to be inserted into the sql database on req.body', () => {
      return supertest(server)
      .post('/')
      .expect('Content-Type, /application\/json')
      .expect(200);
    })
  })

  describe('PUT', () => {
    it ('')
  })
})




describe()
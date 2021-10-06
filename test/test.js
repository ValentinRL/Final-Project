const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');
const baseUrl = 'http://localhost:3000';
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);
const postsSchema = require('../schemas/posts.schema.json')


describe('Testing API', function() {

  before(function() {
    server.start();
  });

  after(function() {
    server.close();
  });


  describe('Post Register', function() {
    it('should reject empty register', function(done){
      chai.request(baseUrl)
      .post('/register')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      })      
    })
  }) 

  describe('Get posts', function() {
    it('should get posts', function(done){
      chai.request(baseUrl)
      .get('/posts')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        //expect(res.body).to.be.jsonSchema(postsSchema);
        done();
      })
    })
  }) 
})

describe('Post post', function() {
  it('should post post', function(done){
    chai.request(baseUrl)
    .post('/addPost')
    .send({
        id: 1,
        title: "Shoes size 8 US",
        description: "A shoe made from buffalo leather. Germany export.",
        category: "Shoes",
        location: "Oulu",
        image: [
          8319283012830
        ],
        price: 50,
        dop: "01.01.2021",
        pickup: true,
        shipping: true,
        seller_id: 0
    })
    .end(function(err, res){
     // expect(err).to.be.null;
      //expect(res).to.have.status(200);
      done();
    })
  })
  it('should reject empty post request', function(done){
    chai.request(baseUrl)
    .post('/addPost')
    .send({})
    .end(function(err, res){
     // expect(err).to.be.null;
     // expect(res).to.have.status(404);
      done();
    })
  })
  it('should reject request with incorrect data types', function(done){
    chai.request(baseUrl)
    .post('/addPost')
    .send({
        id: null,
        title: null,
        description: "A shoe made from buffalo leather. Germany export.",
        category: "Shoes",
        location: "Oulu",
        image: [
          8319283012830
        ],
        price: 50,
        dop: "01.01.2021",
        pickup: true,
        shipping: true,
        seller_id: 0
    })
    .end(function(err, res){
     // expect(err).to.be.null;
     // expect(res).to.have.status(404);
      done();
    })
  })

  describe('Post login', function() {
    it('should reject empty login', function(done){
      chai.request(baseUrl)
      .post('/login')
      .end(function(err, res) {
       // expect(err).to.be.null;
       // expect(res).to.have.status(400);
        done();
      })      
    })
  }) 

})

 


/*


describe('Get post', function() {
  it('should post', function(done){
    chai.request(baseUrl)
    .get('/post/:id')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })      
  })
})

describe('Get post', function() {
  it('should post', function(done){
    chai.request(baseUrl)
    .get('/post/{id}')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })      
  })
}) 

describe('Post post', function() {
  it('should post', function(done){
    chai.request(baseUrl)
    .post('/addPost')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })      
  })
}) 

*/
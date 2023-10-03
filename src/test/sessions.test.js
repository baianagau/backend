import chai from 'chai';
import supertest from 'supertest';
import configureCommander from '../config/commander.config.js';
import configureDotenv from '../config/dotenv.config.js';
import configureMongo from '../config/mongoDB.config.js';
import mongoose from 'mongoose';
import UserMongoManager from '../dao/mongoManagers/users.managers.js';
import { testUser, newUser, testUserPassword } from './dataScenario.js';

//Environment
const env = configureCommander();
configureDotenv(env);

//Chai
const expect = chai.expect;

//Supertest
const host = `http://localhost:${process.env.PORT}`;
const requester = supertest(host);

//managers
const userMongoManager = new UserMongoManager();

const prepareScenario = async () => {
    const user = await userMongoManager.createUser(testUser);
};

const destroyScenario = async () => {
    await userMongoManager.deleteUserByEmail(testUser.email);
    await userMongoManager.deleteUserByEmail(newUser.email);
};

describe('Test api/sessions endpoints', () => {
    before('Before all scripts', async function () {
        this.timeout(10000);
        await configureMongo();
        await prepareScenario();
    });

    describe('register', () => {

        it('POST Should register valid user', async () => {
            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(newUser);
            expect(ok).to.equal(true);
            expect(statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.msg).to.equal('New registered');
            expect(body.user).to.be.a('object');
            expect(body.user.firstName).to.equal(newUser.firstName);
            expect(body.user.lastName).to.equal(newUser.lastName);
            expect(body.user.email).to.equal(newUser.email);
            expect(body.user.birthDate).to.equal(newUser.birthDate);
            expect(body.user.role).to.equal(newUser.role);
            expect(body.user).to.have.property('id');
            expect(body.user.id).to.be.a('string');            
        });

        it('POST Should not register user with existing email', async () => {
            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(testUser);
            expect(ok).to.equal(false);
            expect(statusCode).to.equal(401);
            expect(body.status).to.equal(0);
            expect(body.msg).to.equal('already exists');
        });

    });

    describe('login', () => {

        it('POST Should login valid user', async () => {
            const { statusCode, ok, body , header} = await requester.post('/api/sessions/login').send({
                email: testUser.email, password: testUserPassword
            });
            expect(ok).to.equal(true);
            expect(statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.msg).to.equal('successfully logged in');
            expect(body.jwt).to.be.a('string');

            const cookieResult = header['set-cookie'][0]

            const cookie =  {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }

            expect(cookie.name).to.equal('bronxjwt');
            expect(cookie.value).to.be.a('string');

        });

        it('POST Should not login user with incorrest password', async () => {
            const { statusCode, ok, body } = await requester.post('/api/sessions/login').send({
                email: testUser.email, password: testUserPassword + '1'
            });
            expect(ok).to.equal(false);
            expect(statusCode).to.equal(401);
            expect(body.status).to.equal(0);
            expect(body.msg).to.equal('Password is incorrect');
        });

        it('POST Should not login invalid user', async () => {
            const { statusCode, ok, body } = await requester.post('/api/sessions/login').send({
                email: testUser.email + 'w', password: testUserPassword + '1'
            });
            expect(ok).to.equal(false);
            expect(statusCode).to.equal(401);
            expect(body.status).to.equal(0);
            expect(body.msg).to.equal('Wrong');
        });

    });

    describe('currentuser', () => {
            let session;

            before('Before all scripts in currentuser', async function () {
                const loginResponse = await requester
                    .post('/api/sessions/login')
                    .send({email: testUser.email, password: testUserPassword})
                session = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
            });
            
            it('GET Should get current user', async () => {
                const { statusCode, ok, body } = await requester.get('/api/sessions/currentuser').set('Cookie', [`bronxjwt=${session}`]);
                expect(ok).to.equal(true);
                expect(statusCode).to.equal(200);
                expect(body.status).to.equal(1);
                expect(body.msg).to.equal('logged in');
                expect(body.user).to.be.a('object');
                expect(body.user.firstName).to.equal(testUser.firstName);
                expect(body.user.lastName).to.equal(testUser.lastName);
                expect(body.user.email).to.equal(testUser.email);
                expect(body.user.birthDate).to.equal(testUser.birthDate);
                expect(body.user.role).to.equal(testUser.role);
            });
   
        });

        describe('logout', () => {
            let session;

            before('Before all scripts in logout', async function () {
                const loginResponse = await requester
                    .post('/api/sessions/login')
                    .send({email: testUser.email, password: testUserPassword})
                session = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
            });
            
            it('POST Should logout', async () => {
                const { statusCode, ok, body } = await requester.post('/api/sessions/logout').set('Cookie', [`bronxjwt=${session}`]);
                expect(ok).to.equal(true);
                expect(statusCode).to.equal(200);
                expect(body.status).to.equal(1);
                expect(body.msg).to.equal('successfully logged out');
            });
   
        });

    after('After all scripts', async () => {
        await destroyScenario();
        mongoose.disconnect();
    });

});
// Libraries required for testing
const util = require('util');
const test = require('ava');
const cryptoRandomString = require('crypto-random-string');
const sinon = require('sinon');
const { factory } = require('factory-girl');

const Boom = require('@hapi/boom');
const phrases = require('../../config/phrases');
const config = require('../../config');
const { Users } = require('../../app/models');

const { before, beforeEach, afterEach, after } = require('../_utils');

test.before(before);
test.after.always(after);
test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

test('creates new user', async t => {
  const { web } = t.context;
  const user = [
    {
      id: 1,
      email: 'lordbyron@example.com',
      password: 'something'
    }
  ];
  t.context.register = sinon.stub(Users, 'register').resolves(user);
  t.context.serialize.yields(null, { id: 1 });

  const res = await web.post('/en/register').send({
    email: 'lordbyron@example.com',
    password: '?X#8Hn=PbkvTD/{'
  });

  t.is(res.header.location, '/en/my-account');
  t.is(res.status, 302);

  t.context.register.restore();
});

test('fails registering with easy password', async t => {
  const { web } = t.context;
  t.context.register = sinon
    .stub(Users, 'register')
    .throws(Boom.badRequest(phrases.INVALID_PASSWORD_STRENGTH));

  const res = await web.post('/en/register').send({
    email: 'emilydickinson@example.com',
    password: 'password'
  });

  t.is(res.body.message, phrases.INVALID_PASSWORD_STRENGHT);
  t.is(res.status, 400);

  t.context.register.restore();
});

test('successfully registers with strong password', async t => {
  const { web } = t.context;
  const user = [
    {
      id: 1,
      email: 'test12@example.com',
      password: 'Thi$i$@$r0ng3rP@$$W0rdMyDude'
    }
  ];
  t.context.register = sinon.stub(Users, 'register').resolves(user);
  t.context.serialize.yields(null, { id: 1 });

  const res = await web.post('/en/register').send({
    email: 'test12@example.com',
    password: 'Thi$i$@$r0ng3rP@$$W0rdMyDude'
  });

  t.is(res.body.message, undefined);
  t.is(res.header.location, '/en/my-account');
  t.is(res.status, 302);

  t.context.register.restore();
});

test('successfully registers with stronger password', async t => {
  const { web } = t.context;
  const user = [
    {
      id: 1,
      email: 'test123@example.com',
      password: cryptoRandomString({ length: 50 })
    }
  ];
  t.context.register = sinon.stub(Users, 'register').resolves(user);
  t.context.serialize.yields(null, { id: 1 });

  const res = await web.post('/en/register').send({
    email: 'test123@example.com',
    password: cryptoRandomString({ length: 50 })
  });

  t.is(res.body.message, undefined);
  t.is(res.header.location, '/en/my-account');
  t.is(res.status, 302);

  t.context.register.restore();
});

test('fails registering invalid email', async t => {
  const { web } = t.context;
  const res = await web.post('/en/register').send({
    email: 'test123',
    password: 'testpassword'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_EMAIL);
});

test("doesn't leak used email", async t => {
  const { web } = t.context;
  const user = [
    {
      id: 1,
      email: 'test2@example.com',
      password: '!@K#NLK!#NSADKMSAD:K'
    }
  ];
  t.context.findByUsername = sinon.stub(Users, 'findByUsername').resolves(user);

  const res = await web.post('/en/register').send({
    email: 'test2@example.com',
    password: 'wrongpassword'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.PASSPORT_USER_EXISTS_ERROR);

  t.context.findByUsername.restore();
});

test('allows password reset for valid email (HTML)', async t => {
  const { web } = t.context;

  const user = await factory.build('user');
  t.context.findOne = sinon.stub(Users, 'findOne').resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  const res = await web
    .post('/en/forgot-password')
    .set({ Accept: 'text/html' })
    .send({ email: user.email });

  t.is(res.status, 302);
  t.is(res.header.location, '/');

  t.context.findOne.restore();
  t.context.save.restore();
});

test('allows password reset for valid email (JSON)', async t => {
  const { web } = t.context;

  const user = await factory.build('user');
  t.context.findOne = sinon.stub(Users, 'findOne').resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  const res = await web.post('/en/forgot-password').send({ email: user.email });

  t.is(res.status, 302);
  t.is(res.header.location, '/');

  t.context.findOne.restore();
  t.context.save.restore();
});

test('resets password with valid email and token (HTML)', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;
  const password = '!@K#NLK!#N';

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  t.context.findOne.resolves(user);
  t.context.serialize.yields(null, { id: user.id });

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .set({ Accept: 'text/html' })
    .send({ email, password });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');

  t.context.findOne.restore();
  t.context.save.restore();
});

test('resets password with valid email and token (JSON)', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;
  const password = '!@K#NLK!#N';

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  t.context.findOne.resolves(user);
  t.context.serialize.yields(null, { id: user.id });

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .send({ email, password });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password for non-existent user', async t => {
  const { web } = t.context;
  const email = 'test7@example.com';
  const password = '!@K#NLK!#N';
  t.context.findOne = sinon.stub(Users, 'findOne').resolves(null);

  const res = await web
    .post('/en/reset-password/randomtoken')
    .send({ email, password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);

  t.context.findOne.restore();
});

test('fails resetting password with invalid reset token', async t => {
  const { web } = t.context;
  const user = await factory.build('user');
  const { email } = user;
  const password = '!@K#NLK!#N';

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  t.context.findOne.resolves(null);

  const res = await web
    .post('/en/reset-password/wrongtoken')
    .send({ email, password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password with missing new password', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .send({ email });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password with invalid email', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .send({ email: 'wrongemail' });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_EMAIL);

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password with invalid email + reset token match', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;
  const password = '!@K#NLK!#N';

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  t.context.findOne.resolves(null);

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .send({ email: 'wrongemail@example.com', password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password if new password is too weak', async t => {
  const { web } = t.context;
  let user = await factory.build('user');
  const { email } = user;

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  user = t.context.save.returnValues[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  t.context.findOne.resolves(user);

  const res = await web
    .post(`/en/reset-password/${user[config.userFields.resetToken]}`)
    .send({ email, password: 'password' });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD_STRENGTH);

  t.context.findOne.restore();
  t.context.save.restore();
});

test('fails resetting password if reset was already tried in the last 30 mins', async t => {
  const { web } = t.context;
  const user = await factory.build('user');
  const { email } = user;

  t.context.findOne = sinon.stub(Users, 'findOne');
  t.context.findOne.resolves(user);
  t.context.save = sinon.stub(Users.prototype, 'save').returnsThis();

  await web.post('/en/forgot-password').send({ email });

  t.context.findOne.resolves(t.context.save.returnValues[0]);

  const res = await web.post('/en/forgot-password').send({ email });

  t.is(res.status, 400);
  t.is(
    JSON.parse(res.text).message,
    util.format(phrases.PASSWORD_RESET_LIMIT, 'in 30 minutes')
  );

  t.context.findOne.restore();
  t.context.save.restore();
});

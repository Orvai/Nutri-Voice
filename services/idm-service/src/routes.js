const { Router } = require('express');
const { authRequired } = require('./middleware/auth');

const Auth = require('./controllers/auth.controller');
const User = require('./controllers/user.controller');
const Sub = require('./controllers/subscription.controller');const Info = require('./controllers/userInfo.controller');

const r = Router();

// Public Auth
r.post('/auth/register', Auth.registerUser);
r.post('/auth/login', Auth.login);
r.post('/auth/logout', authRequired, Auth.logout);
r.post('/auth/token/refresh', Auth.refresh);
r.post('/auth/mfa/register', authRequired, Auth.registerMFADevice);
r.post('/auth/mfa/verify', authRequired, Auth.verifyMFA);

// Protected: Users
r.post('/users', authRequired, User.createUser);
r.get('/users', authRequired, User.listUsers);
r.get('/users/:userId', authRequired, User.getUser);
r.patch('/users/:userId', authRequired, User.updateUser);

// Protected: Subscriptions
r.post('/subscriptions', authRequired, Sub.createSubscription);
r.get('/subscriptions', authRequired, Sub.listSubscriptions);
r.get('/subscriptions/:id', authRequired, Sub.getSubscription);
r.patch('/subscriptions/:id', authRequired, Sub.updateSubscription);
r.delete('/subscriptions/:id', authRequired, Sub.deleteSubscription);


// Protected: User Information
r.put('/users/:userId/info', authRequired, Info.upsertUserInformation);
r.get('/users/:userId/info', authRequired, Info.getUserInformation);
r.delete('/users/:userId/info', authRequired, Info.deleteUserInformation);

module.exports = r;

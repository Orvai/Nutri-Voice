const { Router } = require('express');
const verifyInternalToken = require('./middleware/verifyInternalToken');

const Auth = require('./controllers/auth.controller');
const User = require('./controllers/user.controller');
const Sub = require('./controllers/subscription.controller');
const Info = require('./controllers/userInfo.controller');

const r = Router();

// ===== AUTH INTERNAL =====
r.post('/internal/auth/register', verifyInternalToken, Auth.registerUser);
r.post('/internal/auth/login', verifyInternalToken, Auth.login);
r.post('/internal/auth/logout', verifyInternalToken, Auth.logout);
r.post('/internal/auth/token/refresh', verifyInternalToken, Auth.refresh);


// MFA (optional)
r.post('/internal/auth/mfa/register', verifyInternalToken, Auth.registerMFADevice);
r.post('/internal/auth/mfa/verify', verifyInternalToken, Auth.verifyMFA);

// ===== USERS INTERNAL =====
r.post('/internal/users', verifyInternalToken, User.createUser);
r.get('/internal/users', verifyInternalToken, User.listUsers);
r.get('/internal/users/:userId', verifyInternalToken, User.getUser);
r.patch('/internal/users/:userId', verifyInternalToken, User.updateUser);
r.get("/internal/users/by-phone/:phone",verifyInternalToken,User.getUserByPhone);
// ===== USER INFO INTERNAL =====
r.put('/internal/users/:userId/info', verifyInternalToken, Info.upsertUserInformation);
r.get('/internal/users/:userId/info', verifyInternalToken, Info.getUserInformation);
r.delete('/internal/users/:userId/info', verifyInternalToken, Info.deleteUserInformation);

// ===== SUBSCRIPTIONS INTERNAL =====
r.post('/internal/subscriptions', verifyInternalToken, Sub.createSubscription);
r.get('/internal/subscriptions', verifyInternalToken, Sub.listSubscriptions);
r.get('/internal/subscriptions/:id', verifyInternalToken, Sub.getSubscription);
r.patch('/internal/subscriptions/:id', verifyInternalToken, Sub.updateSubscription);
r.delete('/internal/subscriptions/:id', verifyInternalToken, Sub.deleteSubscription);

module.exports = r;

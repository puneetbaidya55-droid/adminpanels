const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const config = require('../src/config/config');

const app = express();
app.use(express.json());
app.use(session({ secret: config.dashboard.secret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: config.clientId,
  clientSecret: config.dashboard.clientSecret,
  callbackURL: config.dashboard.callbackUrl,
  scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => res.redirect('/dashboard'));
app.get('/logout', (req, res) => { req.logout(() => res.redirect('/')); });

app.get('/', (req, res) => res.send('WSGT BOT Dashboard. <a href="/auth/discord">Login with Discord</a>'));
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/discord');
  res.send(`Welcome ${req.user.username}. Dashboard data loading...`);
});

app.get('/api/status', (req, res) => res.json({ ok: true, bot: 'WSGT BOT' }));

const port = config.dashboard.port;
app.listen(port, () => console.log(`Dashboard running on http://localhost:${port}`));
module.exports = app;

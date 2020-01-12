const express = require('express')
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy
const session = require('express-session')

const port = process.env.API_PORT || 3001
const app = express()

const User = {
  users: [
    { username: 'hoge', password: 'fuga', displayname: 'Hoge', email: 'hoge@hoge.hoge' },
    { username: 'hello', password: 'world', displayname: 'Hello', email: 'hello@hello.hello' }
  ],
  findOne(user) {
    return new Promise((resolve, reject) => {
      let found = this.users.find((u) => u.username === user.username)
      if (found) {
        resolve(found)
      } else {
        reject('存在しないユーザーかパスワードが間違っています。 [x-auth:1]')
      }
    })
  }
}

passport.use(
  new DigestStrategy(
    { qop: 'auth' },
    (username, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: '存在しないユーザーかパスワードが間違っています。 [x-auth:2]' })
          }
          return done(null, user, user.password)
        })
        .catch((err) => {
          return done(err)
        })
    },
    (params, done) => {
      done(null, true)
    }
  )
)

app.use(express.static('dist'))
app.use(
  session({
    secret: 'some secret string',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser((username, done) => {
  User.findOne(username)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
})

app.get('/api/me', passport.authenticate('digest', { session: false }), (req, res) => {
  let user = Object.assign({}, req.user)
  delete user.password
  res.json(user)
})

app.listen(port, () => console.log(`listening on ${port}`))

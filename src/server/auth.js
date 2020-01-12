module.exports = {
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

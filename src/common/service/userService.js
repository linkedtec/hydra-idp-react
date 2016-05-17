class UserService {

  constructor() {
      this.users = [
          {
            id: 'john.doe@me.com',
            password: 'foobar'
          },
          {
              id: 'alice.schwarz@me.com',
              password: 'mysecret'
          }
        ]
    }

  authenticate(id, password) {
      const results = this.users.filter((user) => (user.id === id && user.password === password))

      if (results.length > 0) {
          return results[0]
        }

      return null
    }
}

const userService = new UserService()

export default userService

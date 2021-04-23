const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById) {
    const authenticateUser = async (name, password, done) => {
        const user = await getUserByName(name)
        if (user == null) {
            return done(null, false, { message: "No user with that name." })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, { message: "Incorect password." })
            }
        } catch (e) {
            console.log(e)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    },
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initialize
const register = (req, res) => {
    res.send({ status: 1, msg: "New registered" });
};

const login = (req, res) => {
      res.cookie(process.env.AUTH_COOKIE, req.user, { httpOnly: true }).send({ status: 1, msg: 'successfully logged in', jwt: req.user });
};

const resetPassword = (req, res) => {
    res.send({ status: 1, msg: 'Password successfully reseted.' });
};

const logout = (req, res) => {
    const jwtCookie = req.cookies[process.env.AUTH_COOKIE];
    if (!jwtCookie) {
        return res.status(400).send({ status: 0, msg: 'bronx is not logged in.' });
    }    
    res.clearCookie(process.env.AUTH_COOKIE).send({ status: 1, msg: 'successfully logged out' });
};

const github = (req, res) => {
};

const githubCallback = (req, res) => {
    res.cookie(process.env.AUTH_COOKIE, req.user, { httpOnly: true }).redirect('/products');
};

const currentUser = (req, res) => {
    res.send({ status: 1, msg: 'Bronx logged in', user: req.user.user });
};

export default {
    register,
    login,
    resetPassword,
    logout,
    github,
    githubCallback,
    currentUser
};
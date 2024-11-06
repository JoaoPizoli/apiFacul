const Admin = require('../models/Admin');

class AuthController {
    async create(req, res) {
        const { email, password } = req.body;
        const admin = new Admin();

        const result = await admin.login(email, password);
        if (result.status) {
            return res.status(200).json({ token: result.token });
        } else {
            return res.status(401).json({ message: result.message });
        }
    }

}

module.exports = new AuthController();

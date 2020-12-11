const UserModel = require('../models/UserModel');
const jwt = require('../library/jwt')


module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        let accessToken = request.headers.authorization.slice(7);
        let authorized = jwt.verifyAccessToken(accessToken);


        if (!authorized) {
            response.json({ code: 'unauthorized'}, 401);
            return;
        }

        UserModel.getById(authorized.id, (user) => {
            request.currentUser = user;
            next();
        });
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};
const getToken = (req) => {
    const bearerHeader = req.headers['authorization'];
    debugger;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        return bearerToken
    }

    return null
}

module.exports = {
    getToken
}
var distance = require('google-distance')

distance.apiKey = process.env.GOOGL_API_KEY

module.exports.distance = function (origin, destination, callback) {
    distance.get({
        origin: origin,
        destination: destination
    }, callback);
}
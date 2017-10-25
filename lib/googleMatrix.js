var distance = require('google-distance')

distance.apiKey = process.env.GOOGL_API_KEY

module.exports.distance = function (origin, destination, callback) {
    distance.get({
        origin: origin,
        destination: destination
    }, callback);
}

let destinations = ['Uttarakhand technical university', 'Phonics group of institutions', 'Graphics era instititute, dehradun', 'RCE roorkee','quadra institute of nursing']
distance.get({
    origin: 'college of engineering roorkee',
    destinations: destinations
}, (err, data) => {
    
    let distances = []
    data.forEach(function (element,index) {
        distances.push({
            dest: destinations[index],
            distance : element.distance
        })
    }, this);

    distances.sort(function (a, b) {
        return parseFloat(a.distance) - parseFloat(b.distance)
    })

    //console.log(distances)
})
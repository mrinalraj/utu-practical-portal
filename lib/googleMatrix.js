var distance = require('google-distance')

distance.apiKey = process.env.GOOGL_API_KEY

module.exports.distance = function (data, callback) {
    distance.get({
        origin: data.origin,
        destinations: data.destinations
    }, callback);
}

let destinations = ['Uttarakhand technical university', 'Phonics group of institutions', 'Graphics era instititute, dehradun', 'RCE roorkee','quadra institute of nursing']
distance.get({
    origin: 'college of engineering roorkee',
    destinations: destinations
}, (err, data) => {
    //console.log(data)
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
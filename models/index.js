var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/tripplanner');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));


var makeArray = function(v){
    return v.split(",");
}

var Place, Hotel, Restaurant, ThingToDo;

var placeSchema = new mongoose.Schema({
 address:    String,
 city: String,
 state: String,
 phone: String,
 location: [Number]
});

var hotelSchema = new mongoose.Schema({
 name:    String,
 place: [placeSchema],
 num_stars: {type: Number, min: 1, max: 5},
 amenities:  {type: [String], set: makeArray}
});

var restaurantSchema = new mongoose.Schema({
 name:    String,
 place: [placeSchema],
 cuisine: {type: [String], set: makeArray},
 price: {type: Number, min: 1, max: 5}
});

var thingtodoSchema = new mongoose.Schema({
 name:    String,
 place: [placeSchema],
 age_range: String
});

ThingToDo = mongoose.model('ThingToDo', thingtodoSchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);
Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = {
	Hotel: Hotel,
	Place: Place,
	ThingToDo: ThingToDo,
	Restaurant: Restaurant
};
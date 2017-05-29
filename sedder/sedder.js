var Director = require('../models/directors');
var Place = require('../models/places');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').ObjectId;

mongoose.connect('localhost:27017/rest');


var directors = [
    new Director({
        type: 'Type 1',
        leaderName: 'LeaderName 1',
        name: 'Name 1',
        phone: 'Phone 1'
    }),
    new Director({
        type: 'Type 2',
        leaderName: 'LeaderName 2',
        name: 'Name 2',
        phone: 'Phone 2'
    }),
    new Director({
        type: 'Type 3',
        leaderName: 'LeaderName 3',
        name: 'Name 3',
        phone: 'Phone 3'
    }),
    new Director({
        type: 'Type 4',
        leaderName: 'LeaderName 4',
        name: 'Name 4',
        phone: 'Phone 4'
    }),
    new Director({
        type: 'Type 5',
        leaderName: 'LeaderName 5',
        name: 'Name 5',
        phone: 'Phone 5'
    })
];

var id = [];
Director.find(function (err, docs){
    if (err) console.log(err);
    id.push(docs._id);
});

var places = [
    new Place({
        name: 'Name 1',
        type: 'Type 1',
        address: 'Adress 1',
        countOfPlaces: 200,
        idOfDirector: 1,
        date: Date.now(),
        duration: ['Date 1', 'Date 1']
    }),
    new Place({
        name: 'Name 2',
        type: 'Type 2',
        address: 'Adress 2',
        countOfPlaces: 200,
        idOfDirector: 2,
        date: Date.now(),
        duration: ['Date 2', 'Date 2']
    }),
    new Place({
        name: 'Name 3',
        type: 'Type 3',
        address: 'Adress 3',
        countOfPlaces: 200,
        idOfDirector: 3,
        date: Date.now(),
        duration: ['Date 3', 'Date 3']
    })  
];

//seed(directors);
//seed(places);

function seed(array){
    var done = 0;
    for (var i = 0; i < array.length; i++){
        array[i].save(function (err, result) {
            done++;
            if (done === array.length) mongoose.disconnect()
        })
    }
}
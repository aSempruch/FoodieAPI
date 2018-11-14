var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var keys = require('../keys');

function getGIO(address, cb) {
    fetch(`https://api.geocod.io/v1.3/geocode?api_key=${keys.geocodio}&q=${address}`)
        .then(res => res.json())
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

function getRestaurants(location, cb) {
    fetch(`https://developers.zomato.com/api/v2.1/geocode?user-key=${keys.zomato}&lat=${location.lat}&lon=${location.lng}`, {
        headers: {
            'user-key': keys.zomato
        }
    })
        .then(res => res.json())
        .then(res => cb(false, res))
        .catch(err => cb(err));
}

router.get('/', function(req, res, next) {
  var { address } = req.query;

  if(!address) res.send("No address provided");

  getGIO(address, (err, data) => {
      if(err) return res.send("Error getting geocode: " + err);
      getRestaurants(data.results[0].location, (err, data) => {
          if(err) return res.send("Error retrieving restaurants " + err);
          res.send(data);
      });
  });
});

module.exports = router;

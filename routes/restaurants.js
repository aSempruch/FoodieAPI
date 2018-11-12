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

router.get('/', function(req, res, next) {
  var { address } = req.query;

  if(!address) res.send("No address provided");

  getGIO(address, (err, data) => {
    if(err) return res.send("Error getting geocode: " + err);
      res.send(data);
  });
});

module.exports = router;

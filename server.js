// call packages we need
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Set our PORT
const port = process.env.PORT || 8080

// Require model
const Bear = require('./app/models/bear')






// DATABASE
// =========================================================
const mongoose = require('mongoose')
mongoose.connect("mongodb://admin:momsnameandbdaywithoutsymbol@ds117859.mlab.com:17859/bear-db", () => {
  console.log('Database connected!');
})







// ROUTES FOR API
// ==========================================================

// get an instance of the express router
const router = express.Router()

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to our API!'})
})




// on routes that end in /bears
// --------------------------------------------------
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    app.post('/api/bears', (req, res) => {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err){
              res.send(err);
            } else {
              res.json({ message: 'Bear created!'});
            }
        });
    });
    

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    app.get('/api/bears', (req, res) => {
      Bear.find(function(err, bears) {
        if(err) {
          res.send(err)
        } else {
          res.json(bears)
        }
      })
    })

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    app.get('/api/bears/:bear_id', (req, res) => {
      Bear.findById(req.params.bear_id, (err, bear) => {
        if(err)
          res.send(err)
        res.json(bear)
      })
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    app.put('/api/bears/:bear_id', (req, res) => {

      //use our bear model to find the brear we want
      Bear.findById(req.params.bear_id, (err, bear) => {
        if(err) 
          res.send(err)

        bear.name = req.body.name // update the bears info

        // save the bear
        bear.save(err => {
          if(err)
            res.send(err)

          res.json({ message: 'Bear updated!'})
        })
      })
    })

    // delete the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    app.delete('/api/bears/:bear_id', (req, res) => {
      Bear.remove({
        _id: req.params.bear_id
      }, (err, bear) => {
        if(err)
          res.send(err)
        
          res.json({ message: 'Successfully deleted' })
      })
    })



// REGISTER OUR ROUTES -------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)



// START THE SERVER
// =============================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

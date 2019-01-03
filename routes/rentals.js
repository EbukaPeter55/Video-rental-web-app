//we require the rental model using object destructuring with Rental and validate as its properties
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

//Since fawn is a class, we have to call its method
Fawn.init(mongoose);

//Get all list of rentals and sort them out by date in a descending order..
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

//Creating a Http POST request to create a movie in the database
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

//Check whether the client is sending a customer with a valid Id
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

//Check whether the client is sending a movie with a valid Id
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

//Check whether the movie requested is in stock   
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

/** To use the fawn library, We work directly with the database collection hence: rentals, and new rental object. 
   The fawn.Task uses two face commit*/ 
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { 
        $inc: { numberInStock: -1 }
      })
      .run();
  
    res.send(rental);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/NewDBBB")
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log('Error connecting to database', err));

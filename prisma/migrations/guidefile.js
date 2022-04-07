const prisma = require('../utils/prisma')

const getMovies = async (req, res) => {
  
  //Create an object that will store the filters we are going to
  //pass to prisma. It starts of empty which means all records
  //will be returned by default.
  const filters = {
    runtimeMins: {}
  }

  //If a runtimeGreater query string is provided (i.e movies?runtimeGreater=90)
  //then add a filter to the the filters object that will only return movies
  //that have a runtime greater than the value provided
  if(req.query.runtimeGreater) {
    //We use gt as per the prisma docs:https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#gt
    //Query string parameters are always strings, but the runtime field is an integer
    //so convert to an integer before updating the filter
    filters.runtimeMins.gt = parseInt(req.query.runtimeGreater)
  }

  //If a runtimeLess query string is provided (i.e movies?runtimeLess=200)
  //then add a filter to the the filters object that will only return movies
  //that have a runtime less than the value provided
  if(req.query.runtimeLess) {
    //We use lt as per the prisma docs:https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#lt
    //Query string parameters are always strings, but the runtime field is an integer
    //so convert to an integer before updating the filter
    filters.runtimeMins.lt = parseInt(req.query.runtimeLess)
  }

  //Find all movies
  const movies = await prisma.movie.findMany({
    //Pass the filters to prisma
    where : filters,
    //Tell prisma we want to include the screenings for this movie
    // as part of the response
    include: {
      screenings: true
    }
  })

  //Return the movies back to the client
  res.json({movies: movies})
}

const createMovie = async (req, res) => {
  
  //Get the title and runtime properties from the request body
  const { title,runtime} = req.body

  //Create the object we are going to pass to the prisma create
  //method. For now, this only contains the movie data, but we'll
  //update this with the associated screenings if they are also
  //provided in the request
  const movieData = {
    data: {
      title: title,
      runtimeMins: runtime
    } 
  }

  //Check if the request body has a screenings property set - if 
  //it does, we want to add those screenings as part of the movie.
  //We'll use prisma's nested writes feature to do this.
  //
  //https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
  //
  //This code assumes the request body looks something like this:
  //
  // {
  //   "title": "Dune",
  //   "runtime": 182,
  //   "screenings" : [
  //       { "startsAt": "2022-04-05T10:20:00" , "screenId": 1},
  //       { "startsAt": "2022-04-05T13:20:00" , "screenId": 1}
  //   ]
  // }
  //
  if (req.body.screenings) {
    
    const screeningsToCreate = []

    //Go through each of the screenings provided in the 
    //request body screenings property. We're just assuming this 
    //is an array here - in a real API we'd have more validation
    for(const requestScreening of req.body.screenings) {

      //For each screening sent by the client, create an object 
      //on the screeningsToCreate to array that contains the data
      // we want to add to the database for that screening.
      screeningsToCreate.push({
        //convert the startsAt from the request body to an actual Date
        //object from a string. Since the startsAt field is declared
        //as a DateTime in prisma, we need to provide it with a Date
        //otherwise it will throw an error
        startsAt: new Date(Date.parse(requestScreening.startsAt)),
        screenId: requestScreening.screenId
      })
    }
    
    //Update the screenings property of the movieData with the 
    //associated screenings we want to create.
    movieData.data.screenings = {
      create: screeningsToCreate
    } 
  }


  //Use prisma to create the movie
  const createdMovie = await prisma.movie.create(movieData)

  res.json({data: createdMovie})

}

module.exports = { getMovies, createMovie }
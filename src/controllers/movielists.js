const req = require('express/lib/request')
const res = require('express/lib/response')
const prisma=require('../utils/prisma')



const getAllMovies = async (req, res) => {

    const whereClauses={
        runtimeMins: {}
    }
    console.log(req.query)

    if(req.query.runtimeGreater!==undefined){
        whereClauses.runtimeMins.gt=parseInt(req.query.runtimeGreater)
    }

    if(req.query.runtimeLess!==undefined){
        whereClauses.runtimeMins.lt=parseInt(req.query.runtimeLess)
    }
    const movies= await prisma.movie.findMany({
        where: whereClauses,
            include:{
                screenings: true
            }

    })

    res.json({movie: movies})
}

const createMovie=async (req, res) => {
    //console.log('Inside create movie')

    const {
        title,
        runtime
    } = req.body


    const createdMovie = await prisma.movie.create({
        data: {
            title: title,
            runtimeMins: runtime
        }
    })

    res.json({data: createdMovie})
}


const singularMovie=async (req, res) => {
 
const singleMovie = await prisma.movie.findUnique({
    
    where: {
      id:parseInt(req.params.id)
    },
  })

  if (singleMovie===null) {
      res.json({Error:'Movie not found'})
      return
  }
  console.log('moviebyId', singleMovie)
  res.json({data: singleMovie})
}

module.exports={getAllMovies, createMovie, singularMovie}
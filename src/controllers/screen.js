const req = require('express/lib/request')
const res = require('express/lib/response')
const prisma=require('../utils/prisma')



const createScreen=async (req, res) => {

    const {
        number
    } = req.body


    const createdScreen = await prisma.screen.create({
        data: {
            number:parseInt(req.body.number)
        }
    })

    res.json({data: createdScreen})
}

module.exports= {createScreen}
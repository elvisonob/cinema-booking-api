const req = require('express/lib/request')
const res = require('express/lib/response')
const prisma=require('../utils/prisma')

const createdTicket=async (req, res) => {


const createTicket = await prisma.ticket.create({
    data: {
      screening: req.body.screeningId,
      customer: req.body.customerId },
    // include: {
    //   screening: { include: { screen: true, movie: true } },
    //   customer: true,
    // },
})
    res.json({data: createTicket})

}

module.exports= {createdTicket}
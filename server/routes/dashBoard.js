const express = require('express')
const router = express.Router();
const pool = require('../db')


router.get('/admin/dashBoard', async(req, res) => {
    const blocks = await pool.query(`SELECT * FROM blocks`)
    res.json(blocks)
    // console.log(blocks[0])
})


router.get(`/indexTime`, async(req, res) => {
    // const {index, timestamp} = req.body.data
    const blocks = await pool.query(`SELECT * FROM blocks`)
    res.json(blocks)
})

module.exports = router;
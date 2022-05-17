const express = require('express')
const router = express.Router();
const pool = require('../db')

router.post('/userData', async(req, res) => {
    const userEmail = req.body.data
    // console.log(userEmail)
    const [result] = await pool.query(`SELECT * FROM signUp WHERE email= '${userEmail}'`)
    // console.log(result)
    res.json(result)
})


// router.get('/admin/dashBoard', async(req, res) => {
//     const blocks = await pool.query(`SELECT * FROM blocks`)
//     res.json(blocks);
//     console.log(blocks[0]);
// })

// router.get('/block', async (req, res) => {
//     console.log("blocks");
//     console.log(req.query);
//     let blockIndex = parseInt(req.query.index);
//     console.log(blockIndex);
//     const blocks = await pool.query(`SELECT * FROM blocks WHERE index= '${blockIndex}'`)
//     console.log("data:", blocks[0]);
//     // res.json(blocks);
//     // console.log(blocks[0]);
// })


// router.get(`/indexTime`, (req, res) => {
//     const {index, timestamp} = req.body.data
//     const blocks = await pool.query(`SELECT * FROM blocks index=${index}' and timestamp = '${timestamp}'`)
//     res.json(blocks)
// })

module.exports = router;
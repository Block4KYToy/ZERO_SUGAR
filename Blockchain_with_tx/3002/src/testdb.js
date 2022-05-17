import { pool } from './db.js';

async function select() {
    try {

        const sql = `SELECT * FROM blocks_tx`
        const [result] = await pool.query(sql) // pool.query -> getConnection + query + release 전부다 가능함.(개사기)
        console.log(result)
        for (let block of result) {
            block.data = JSON.parse(block.data)
            console.log('data parsed')
        }
        console.log(result[0].data)

    } catch (e) {
        console.log(e)
        console.log('에러?')
    }
}
select()
const { Pool } = require('pg');
const dotenv = require('dotenv');


// use .env uri 
dotenv.config();

const pool =  new Pool({
  connectionString: 'postgres://bbewjnpx:cctSeBZ_FfPVs6I4rcbpjgCQhdv2IgXW@heffalump.db.elephantsql.com/bbewjnpx'
})


module.exports = {
  query: (text, params, callback) => {
    // do this each time a query is executed
    console.log('executed query ', text)
    return pool.query(text, params, callback)
  }
}

const mongoose = require('mongoose');
require('dotenv').config();



const connectdb = async ()=>{

    await mongoose.connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log('connencted');
    })

}



module.exports = connectdb;
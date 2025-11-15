const  mongoose = require('mongoose');

const connectDB = async () => {
     await mongoose.connect("mongodb+srv://yogeshsadhasivam_db_user:iQkhpOJkOcB2hzMB@logu.sqcyusq.mongodb.net/user")
};

connectDB() 
   .then(() =>{
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Database connection failed", err);
    });


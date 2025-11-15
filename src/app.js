const express = require("express");

const app = express();

require("./config/database");

const User = require("./model/user");

const PORT = 3000;

app.use(express.json());

app.put("/updateuser", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({email : req.body.email},{ firstName: req.body.firstName });
    console.log("Updated User:", updatedUser);
    res.send("User Updated Successfully");
  }
  catch (err) {
    console.log("Error in updating user", err.message);
    res.send("User not Updated Successfully");
  }
});
  

app.delete("/logout", async (req, res) => {
  try{
     const deleteUser = await User.findOneAndDelete({email: req.body.email});
     console.log("Deleted User:", deleteUser);
     res.send("User Deleted Successfully");
  }
  catch(err){
    console.log("Error in logging out user", err);
    res.status(500).send("User not Deleted Successfully");
  }
});

app.get("/login" , async (req,res) => {
  try { 
    const allUsers = await User.findById(req.body.userId);
    console.log(allUsers);
    res.send(allUsers);    
  } catch (error) {
    res.status(500).send("Error in fetching users" , error.message);
  }
})

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    console.log("Error in signing up user", err);
  }
});

//It will handle only GET requests that come to /test route
app.get("/test", (req, res) => {
  console.log(req.query);
  res.send({ firstName: "Yogesh", lastName: "Sadhasivam" });
});

app.post("/test/:userId/:userName", (req, res) => {
  console.log(req.params);
  res.send("This is a POST request test route");
});

app.delete("/test", (req, res) => {
  res.send("This is a DELETE request test route");
});

//It will handle all the requests that come to /test route
//We can able to make multiple callbacks
//For one Route we can able to use multiple route handlers
// GET /user route => middleware chain => request handler
app.use(
  "/helloworld",
  (req, res, next) => {
    res.send("This is a helloworld route");
    next();
  },
  (req, res, next) => {
    console.log("This is second callback");
    next();
  },
  (req, res) => {
    res.send("This is a helloworld route");
    console.log("This is third callback");
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

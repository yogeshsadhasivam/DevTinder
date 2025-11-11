const express = require('express');

const app = express();

const PORT = 3000;

//app.use means whatever the request comes in with the app will respond with "Hello World"


app.use('/helloWorld' ,(req,res) => {
    res.send("Hello World from /helloworld route");
});

app.use('/test' , (req,res) => {
    res.send("This is a test route");
});

app.use('/',(req,res) => {
    res.send("Hello world");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

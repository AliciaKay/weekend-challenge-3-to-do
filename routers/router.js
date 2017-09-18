//require the custom router file
var router = require('express').Router();
//require the pool file
var pool = require('../modules/pool');

//when the get call is made...
router.get('/', function (req, res) {
    console.log('in the tasks get');
    //connect the the pool file and tell the client to send all table items back
    pool.connect(function (conErr, client, done){
        if (conErr){
            console.log(conErr);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM todo', function (queryErr, resultObj){
                done();
                if (queryErr){
                    console.log(queryErr);
                    res.sendStatus(500);
                } else {
                    console.log(resultObj.rows);
                    res.send(resultObj.rows);
                }
            });
        }
    })
});
//when the post call is made...
router.post('/', function (req, res) {
    //assign a variable to hold the item sent from the front-end client, req.body
    var newTask = req.body;
    //connect the pool file and tell the client to insert the posted item to the DB, using the variable and the object's properties
    pool.connect(function (conErr, client, done){
        if (conErr){
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO todo (task, description, complete) VALUES ($1,$2, $3)', [newTask.name, newTask.description, newTask.complete], function(queryErr, resultObj) {
                done();
                if (queryErr) {
                    res.sendStatus(500)
                 } else {
                    res.sendStatus(201)
                 }
            });
        }
    })
});
//when the delete call is made...
router.delete('/:id', function(req,res){
    //assign a variable to hold the id of the item being deleted, req.params.id
    var dbId= req.params.id;
    //connect the pool file and tell the client to delete the item that matches the id within the variable
    pool.connect(function (conErr, client, done){
        if (conErr){
            console.log(conErr);
            res.sendStatus(500);
        } else {
            client.query('DELETE FROM todo WHERE id = $1;', [dbId], function(queryErr, result){
                done();
                if(queryErr){
                    res.sendStatus(500);
                } else {
                    res.sendStatus(202);
                }
            }) ;
        }
    }
)}); 
//when the put call is made...
router.put('/:id', function(req, res) {
    //assign a variable to hold the id of the item being updated, req.params.id
    var taskCompleteId = req.params.id;
    //connect to the pool file and tell the client to update the item that matches the id within the variable 
    pool.connect(function(connectError, client, done) {
        if (connectError) {
            console.log('connection error:', connectError);
            res.sendStatus(500);
        } else {
            var queryString = 'UPDATE todo SET complete = true WHERE complete = false AND id = $1';
            var values = [taskCompleteId];
            client.query(queryString, values, function(queryError, resultsObj) {
                if (queryError) {
                    console.log('query error:', queryError);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});
//export this router as a module
module.exports = router;
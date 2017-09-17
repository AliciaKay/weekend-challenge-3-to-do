var router = require('express').Router();
var pool = require('../modules/pool');

router.get('/', function (req, res) {
    console.log('in the tasks get');
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

router.post('/', function (req, res) {
    var newTask = req.body;
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

router.delete('/:id', function(req,res){
    var dbId= req.params.id;
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

router.put('/:id', function(req, res) {
    var taskCompleteId = req.params.id;
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

module.exports = router;
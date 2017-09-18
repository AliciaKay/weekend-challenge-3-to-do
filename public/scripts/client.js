$(document).ready(onReady);

function onReady(){
    //get complete list
    getTask();
    //when the add button is clicked, add a task
    $('#addButton').on('click', addTask);
    //if a button of the class deleteMe is clicked on the allTasks table, run delete task function
    $('#allTasks').on('click', '.deleteMe', deleteTask);
    //if a button of the class deleteMe is clicked on the completedTable table, run delete task function
    $('#completedTable').on('click', '.deleteMe', deleteTask);
    //if the state of the checkbox of the class checked is clicked on the allTasks table, run the completeTask function
    $('#allTasks').on('change', '.checked', completeTask);
};

function getTask(){
    //ajax GET info from the server
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function(response){
            console.log('ajax get task', response);
            //empty both tables
            $('#allTasks').empty();
            $('#completedTable').empty(); 
            //loop through the server response array and assign variables 
            for(var i = 0; i < response.length; i++){
                var task = response[i];
                var taskId = task.id;
                var taskName = task.task;
                var taskDesc = task.description;
                var completeStatus = task.complete;
                console.log('line 19 of GET TASK', task);
                //append each item to the DOM as a table row with a checkbox and a delete button
                var $row = $('<tr class="table-striped"></tr>');
                $row.append('<td>' + taskName + '</td>');
                $row.append('<td>' + taskDesc + '</td>');
                //if the task is recorded in the DB as complete, check the checkbox
                    if (completeStatus === false) {
                        $row.append('<td>' + '<input class="checked" type="checkbox" data-id="' + taskId+ '"></td>');
                    } else if (completeStatus === true) {
                        $row.append('<td>' + '<input class="checked" type="checkbox" data-id="' + taskId + '"checked></td>');
                    } 
                var $deleteButton = $('<td><button class="deleteMe btn-danger" data-id="' + taskId + '">Remove</button></td>');
                $row.append($deleteButton);
                $('#allTasks').append($row);
                //run the append completed tasks on all items that have checked boxes 
                appendCompletedTask();
                };
        }
    })
};

function addTask(){
    //take values from the input boxes and create an object
    var objectToSend ={
        name: $('#nameIn').val(),
        description: $('#taskIn').val(),
        //initally mark each task as incomplete
        complete: false
    }
    //empty out the input boxes
    $('#nameIn').val(''); 
    $('#taskIn').val('');
    //ajax POST the object created from the values to the server
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: objectToSend,
        success: function(response){
            console.log('ajax post task', response);
            //run the getTask function to refresh the DOM
            getTask();
        }
    })
};

function deleteTask(){
    console.log('inside deleteTask row 56', thisId);
    //assign a variable based on the object's id
    var thisId = $(this).data('id');   
    //create a confirm dialog box with custom text and buttons (bootstrap + additional plugin)     
      BootstrapDialog.confirm({
        title: 'Delete Task From History?',
        message: 'This action cannot be undone.',
        type: BootstrapDialog.TYPE_WARNING, 
        closable: true, 
        draggable: true, 
        btnCancelLabel: 'Cancel', 
        btnCancelClass: 'btn-success',
        btnOKLabel: 'Delete', 
        btnOKClass: 'btn-danger',
        callback: function(result) {
            //if the user confirms, ajax DELETE the item from the DB that matches the id in the variable
            if(result) {
                $.ajax({
                    method: 'DELETE',
                    url: '/tasks/' + thisId,
                    success: function(response){
                        console.log('ajax post task', response);
                        //run the getTask function again to refresh the DOM
                        getTask();
                    }
                })
            };
        }
    });
}
//when the checkbox is checked...
function completeTask() {
    //assign variable based on this object's id
    var thisId = $(this).data('id');
    //wrap it in an object to send to DB
    var taskToSend = {
        id: thisId,
    };
    //ajax PUT the updated object that matches the id in the variable
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + thisId,
        data: taskToSend,
        success: function(response){
            console.log('ajax put task', response);
            //run the append function 
            appendCompletedTask();
        }
    })
};



//for each checked box in the table, append its row to the completedTable table
function appendCompletedTask() {
    $('table tbody').find('input[class="checked"]').each(function() {
        if($(this).is(':checked')){ 
            $('#completedTable').append($(this).parents('tr'));
            //add the success class (bootstrap class) to change the appearance of the row
            $(this).parents().addClass('success');
            //replace the checked box with a static glyphicon
            $(this).replaceWith('<span class="glyphicon glyphicon-ok-sign"></span>');
            //remove the original row from the all tasks table
            $(this).parents("tr").remove();
        }
    })
};
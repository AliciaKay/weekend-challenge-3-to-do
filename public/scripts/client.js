$(document).ready(onReady);

function onReady(){
    getTask();
    $('#addButton').on('click', addTask);
    $('#allTasks').on('click', '.deleteMe', deleteTask);
    $('#completedTable').on('click', '.deleteMe', deleteTask);
    $('#allTasks').on('change', '.checked', completeTask);
};

function getTask(){
  
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function(response){
            console.log('ajax get task', response);
            $('#allTasks').empty();
            $('#completedTable').empty();  
            for(var i = 0; i < response.length; i++){
                var task = response[i];
                var taskId = task.id;
                var taskName = task.task;
                var taskDesc = task.description;
                var completeStatus = task.complete;
                };
                console.log('line 19 of GET TASK', task);
                var $row = $('<tr class="table-striped"></tr>');
                $row.append('<td>' + taskName + '</td>');
                $row.append('<td>' + taskDesc + '</td>');
                    if (completeStatus === false) {
                        $row.append('<td>' + '<input class="checked" type="checkbox" data-id="' + taskId+ '"></td>');
                    } else if (completeStatus === true) {
                        $row.append('<td>' + '<input class="checked" type="checkbox" data-id="' + taskId + '"checked></td>');
                    } 
                var $deleteButton = $('<td><button class="deleteMe" data-id="' + taskId + '">Remove</button></td>');
                $row.append($deleteButton);
                $('#allTasks').append($row); 
        }
    })
};

function addTask(){
    var objectToSend ={
        name: $('#nameIn').val(),
        description: $('#taskIn').val(),
        complete: false
    }
    $('#nameIn').val(''); 
    $('#taskIn').val('');

    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: objectToSend,
        success: function(response){
            console.log('ajax post task', response);
            getTask();
        }
    })
};

function deleteTask(){
    console.log('inside deleteTask row 56', thisId);
    var thisId = $(this).data('id');
    if (confirm('Are you sure you want to remove this task? (This action cannot be undone)'))
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + thisId,
        success: function(response){
            console.log('ajax post task', response);
            getTask();
        }
    })
};

function completeTask() {
    var thisId = $(this).data('id');
    var taskToSend = {
        id: thisId,
    };
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + thisId,
        data: taskToSend,
        success: function(response){
            console.log('ajax put task', response);
            appendCompletedTask();
        }
    })
};

function appendCompletedTask() {
    $('table tbody').find('input[class="checked"]').each(function() {
        if($(this).is(':checked')){ 
            $('#completedTable').append($(this).parents("tr"));
            $(this).replaceWith('<span class="glyphicon glyphicon-ok-sign"></span>');
            $(this).parents("tr").remove();
        }
    })
};
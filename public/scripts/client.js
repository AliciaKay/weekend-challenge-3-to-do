$(document).ready(onReady);

function onReady(){
    getTask();
    $('#addButton').on('click', addTask);
    $('#allTasks').on('click', '.deleteMe', deleteTask)
};

function getTask(){
    
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function(response){
            console.log('ajax get task', response);
            $('#allTasks').empty();
            for(var i = 0; i < response.length; i++){
                var task = response[i];
                console.log('line 19 of GET TASK', task);
                var $row = $('<tr></tr>');

                $row.append('<td>' + task.name + '</td>');
                $row.append('<td>' + task.description + '</td>');
                $row.append('<td>' + '<input type="checkbox" class="checked">' + '</td>');

                var $deleteButton =$('<td><button class="deleteMe" data-id="' + task.id + '">Remove</button></td>');
                $row.append($deleteButton);
                $('#allTasks').append($row);
            };
        }
    });
};

function addTask(){
    var objectToSend ={
        name: $('#nameIn').val(),
        description: $('#taskIn').val(),
        complete: 0
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
    var thisId = $(this).data('id');
    console.log('inside deleteTask row 55', thisId);

    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + thisId,
        success: function(response){
            console.log('ajax post task', response);
            getTask();
        }
    })
};
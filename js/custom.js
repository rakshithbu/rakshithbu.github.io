
let db;

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top').click(function () {
        $("html, body").animate({scrollTop: 0}, 600);
        return false;
    });

});



    let request = indexedDB.open('RVVHome', 1);

    request.onerror = function () {
        console.log('Database failed to open');
    };

// onsuccess handler signifies that the database opened successfully
    request.onsuccess = function (event) {
        db = event.target.result;
    };

    request.onupgradeneeded = function(e) {
        // Grab a reference to the opened database
        db = e.target.result;
        let objectStore = db.createObjectStore('registration', { keyPath: 'id', autoIncrement:true });
        objectStore.createIndex('firstName', 'firstName', { unique: false });
        objectStore.createIndex('lastName', 'lastName', { unique: false });
        objectStore.createIndex('emailId', 'emailId', { unique: true });
        objectStore.createIndex('sex', 'sex', { unique: false });
        objectStore.createIndex('dob', 'dob', { unique: false });
        objectStore.createIndex('password', 'password', { unique: false });

        let messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement:true });
        messageStore.createIndex('name', 'name', { unique: false });
        messageStore.createIndex('emailId', 'emailId', { unique: false });
        messageStore.createIndex('messages', 'messages', { unique: false });
        console.log('Database setup complete');

        let bookRoom=  db.createObjectStore('bookRoom', { keyPath: 'id', autoIncrement:true });
        bookRoom.createIndex('emailId', 'emailId', { unique: false });
        bookRoom.createIndex('roomType', 'roomType', { unique: false });
        bookRoom.createIndex('numberOfDays', 'numberOfDays', { unique: false });
        console.log('Database setup complete');
    }




function registerUser() {
    if(validateRegistration()){
        var db = request.result;
        let transaction = db.transaction(['registration'], 'readwrite');
        let objectStore = transaction.objectStore('registration');
        if ('getAll' in objectStore) {
            // IDBObjectStore.getAll() will return the full set of items in our store.
            objectStore.getAll().onsuccess = function(event) {
                let arrayOfResult = event.target.result;
                var flag = false;
                arrayOfResult.forEach(function(element, index) {
                    if(element.emailId === $("#emailId").val()){
                        flag = true;
                    }
                });

                if(flag){
                    $("#emailError").show();
                    $("#emailError").text("This email ID already exists");
                    setTimeout(function(){
                        $("#emailError").hide();
                        $("#emailError").text("");
                    }, 6000);
                }else{
                    objectStore.add({firstName:$("#firstName").val(),lastName:$("#lastName").val(),emailId:$("#emailId").val(),sex:$("input[name='gender']:checked").val(),dob:$("#date").val(),password:$("#password").val() });
                    alert("Succesfully Registered " + $("#firstName").val()+" "+$("#lastName").val());
                }
            };
        }
    }

}

function validateRegistration(){

  if($("#firstName").val() === ""){
      $("#firstNameError").show();
      $("#firstNameError").text("Please enter your first name");
      setTimeout(function(){
          $("#firstNameError").hide();
          $("#firstNameError").text("");
      }, 6000);
      return false;
  }
    if($("#lastName").val() === ""){
        $("#lastNameError").show();
        $("#lastNameError").text("Please enter your last name");
        setTimeout(function(){
            $("#lastNameError").hide();
            $("#lastNameErrorsq").text("");
        }, 6000);
        return false;
    }
    if($("#emailId").val() === ""){
        $("#emailError").show();
        $("#emailError").text("Please enter your email id");
        setTimeout(function(){
            $("#emailError").hide();
            $("#emailError").text("");
        }, 6000);
        return false;
    }else {

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String($("#emailId").val()).toLowerCase())) {
            $("#emailError").show();
            $("#emailError").text("Please enter correct email-id format");
            setTimeout(function () {
                $("#emailError").hide();
                $("#emailError").text("");
            }, 6000);
            return false;
        }
    }

    if($("input[name='gender']:checked").length === 0){
        $("#dateError").show();
        $("#dateError").text("Please select you gender");
        setTimeout(function(){
            $("#dateError").hide();
            $("#dateError").text("");
        }, 6000);
        return false;
    }

    if($("#date").val() === ""){
        $("#dateError").show();
        $("#dateError").text("Please enter your password");
        setTimeout(function(){
            $("#dateError").hide();
            $("#dateError").text("");
        }, 6000);
        return false;
    }

    if($("#password").val() === ""){
        $("#passwordError").show();
        $("#passwordError").text("Please enter your password");
        setTimeout(function(){
            $("#passwordError").hide();
            $("#passwordError").text("");
        }, 6000);
        return false;
    }

    if($('#fictionCheck:checkbox:checked').length=== 0){
        $("#fictionCheckError").show();
        $("#fictionCheckError").text("Please check the checkbox");
        setTimeout(function(){
            $("#fictionCheckError").hide();
            $("#fictionCheckError").text("");
        }, 6000);
        return false;
    }
    return true;
}

function login(){
    var db = request.result;
    let transaction = db.transaction(['registration'], 'readwrite');
    let objectStore = transaction.objectStore('registration');
    if ('getAll' in objectStore) {
        // IDBObjectStore.getAll() will return the full set of items in our store.
        objectStore.getAll().onsuccess = function(event) {
            let arrayOfResult = event.target.result;
            var flag = false;
            var name ='';
            arrayOfResult.forEach(function(element, index) {
                if((element.emailId === $("#userName").val()) &&
                    (element.password === $("#password").val())){
                    flag = true;
                    name = element.firstName+" "+ element.lastName;
                }
            });

            if(flag){
                alert("Welcome "+name+" you have succesfuly logged in");
            }else{
                alert("Entered username or password is incorrect");
            }
        };
    }

}

function sendQuery(){
    var db = request.result;
    let transaction = db.transaction(['messages'], 'readwrite');
    let objectStore = transaction.objectStore('messages');
    objectStore.add({name:$("#name").val(),message:$("#message").val(),emailId:$("#emailId").val()});
    alert("Message has been sent successfully");
    }

function booknow(){
    window.location.href = "bookroom.html";
}

function book(){
    var db = request.result;
    let transaction = db.transaction(['registration'], 'readwrite');
    let objectStore = transaction.objectStore('registration');
    if ('getAll' in objectStore) {
        objectStore.getAll().onsuccess = function(event) {
            let arrayOfResult = event.target.result;
            var flag = false;
            arrayOfResult.forEach(function(element, index) {
                if(element.emailId === $("#emailId").val()){
                    flag = true;
                }
            });

            if(!flag){
                alert("This user does not exists. Please register and try again");
            }else{

                let transaction1 = db.transaction(['bookRoom'], 'readwrite');
                let objectStore1 = transaction1.objectStore('bookRoom');
                objectStore1.add({emailId:$("#emailId").val(),roomType:$("#roomType").val(),numberOfDays:$("#numberOfDays").val()});
                alert("Room booked successfully");
            }
        };    }


}


function viewAllActivities() {
    var db = request.result;
    let transaction = db.transaction(['registration'], 'readwrite');
    let objectStore = transaction.objectStore('registration');
    if ('getAll' in objectStore) {
        // IDBObjectStore.getAll() will return the full set of items in our store.
        objectStore.getAll().onsuccess = function (event) {
            let arrayOfResult = event.target.result;
            var flag = false;
            var name = '';
            var html = ""
            arrayOfResult.forEach(function (element, index) {
                html += "<tr>";
                html += "<td> Registration</td>";
                html += "<td>" + element.firstName + " " + element.lastName + " with email address " + element.emailId + " has succesfully registered. </td>";
                html += "</tr>";
            });
            $("#table").append(html);
        };
    }
        let transaction1 = db.transaction(['messages'], 'readwrite');
        let objectStore1 = transaction1.objectStore('messages');
        if ('getAll' in objectStore1) {
            // IDBObjectStore.getAll() will return the full set of items in our store.
            objectStore1.getAll().onsuccess = function (event) {
                let arrayOfResult = event.target.result;
                var flag = false;
                var name = '';
                var html = ""
                arrayOfResult.forEach(function (element, index) {
                    html += "<tr>";
                    html += "<td> Query Raise</td>";
                    html += "<td>" + element.name + "  with email address " + element.emailId + " has written message :  "+element.message+". </td>";
                    html += "</tr>";
                });
                $("#table").append(html);
            };
        }

    let transaction2 = db.transaction(['bookRoom'], 'readwrite');
    let objectStore2 = transaction2.objectStore('bookRoom');
    if ('getAll' in objectStore2) {
        // IDBObjectStore.getAll() will return the full set of items in our store.
        objectStore2.getAll().onsuccess = function (event) {
            let arrayOfResult = event.target.result;
            var flag = false;
            var name = '';
            var html = ""
            arrayOfResult.forEach(function (element, index) {
                html += "<tr>";
                html += "<td> Room Book</td>";
                html += "<td>"+ element.emailId + " has booked "+element.roomType+" for "+element.numberOfDays+" days. </td>";
                html += "</tr>";
            });
            $("#table").append(html);
        };
    }

    $("#table").show();
}

function clearForm(){
    $('#myForm').trigger("reset");
}

 $(document).ready(function() {

    //INITIALIZING SELECT
    $('select').material_select();
    //INITIALIZING MODAL
    $('#modalEvent').modal();
    $('#modalRegisterEvent').modal();
    $('#modalRegisterStaff').modal();
    $('#modalUpdateEvent').modal();
});

const APIlink="http://localhost:3000";
const cloudinaryLink="http://res.cloudinary.com/id-exam/image/upload/";

//LOGIN PAGE
var sCorrectAdminEmail = "admin@gmail.com";
var sCorrectAdminPassword = "123";

var dashboard = document.querySelector("#dashboard");
var loginPage = document.querySelector("#loginPage");
document.getElementById("btnLogin").addEventListener("click", function(){
    var loginFormEmail = document.getElementById("email").value;
    var loginFormPassword = document.getElementById("password").value;
    if ( sCorrectAdminEmail == loginFormEmail && sCorrectAdminPassword == loginFormPassword )
        {
            loginPage.classList.add("destroy");
            dashboard.classList.remove("destroy");
            dashboard.classList.add("active");
        }
    else{
            alert("wrong login details");
    }
});


//----------------------------------------------------------------------------------------------------
//NAV + CLICK EVENTS
document.addEventListener('click', function(e){
            menuNavigation(e);
            buttonEventModal(e);
        });

function menuNavigation(e){
    var pageId=e.target.getAttribute('data-page');
    var navId=e.target.getAttribute('data-nav');
    if (pageId){
        var pages = document.querySelectorAll(".page");
        for (var i=0;i<pages.length;i++){
            pages[i].style.display="none";
        }
        var pageClicked = document.getElementById(pageId);
        pageClicked.style.display="block";
    }   
    
    if (navId){
        var navbar = document.querySelectorAll(".nav");
        for (var i=0;i<navbar.length;i++){
            navbar[i].classList.remove("nav-active");
        }
        var navClicked = document.getElementById(navId);
        navClicked.classList.add("nav-active");
        console.log(navClicked);
    }
}

//MODAL - get the info of a particular event
var modalEventDiv = document.querySelector('#modalEvent');
function buttonEventModal(e){
    var eventId = e.target.getAttribute('data-event');
    if(eventId){
        eventId=Number(eventId);
        $.get(APIlink+'/events/get/'+eventId, function(event){
            console.log(event);
            var modalEventTemplate = `<div class="modal-content">
            <div class="left">
                <img src="${cloudinaryLink+event.image_src}">
                <div id="mapEvent"></div>
            </div>
            <div class="right">
                <h4>${event.title}</h4>
                <h5><em>${event.date}</em></h5>
                <h5><em>${event.location}</em></h5>
                <h5><em>Price:${event.entrance_fee} dkk</em></h5>
                <h5><em><strong>Speakers:John Smith</strong></em></h5>
                <p>${event.description}</p>
                <h5>10/100 places left</h5>
            </div>
         </div>`;
            
            modalEventDiv.innerHTML = modalEventTemplate;
            initMap();
        })
    }
}

//MAP
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('mapEvent'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

//CREATING EVENT CARDS
var eventsCardsDiv = document.querySelector("#event-cards");

$.get(APIlink+'/events', function(data){
    var aEvents = data;
    console.log(data);
    for (let i=0;i<aEvents.length;i++){
        var event=aEvents[i];
        var eventCardTemplate=`<div class="card">
        <div class="card-image">
            <img src="${cloudinaryLink+`/c_scale,q_auto,w_600/`+event.image_src}">
            <div class="card-buttons">
                <i class="material-icons">edit</i>
                <i class="material-icons">delete</i>
            </div>
        </div>
        <div class="card-content">
            <span class="card-title">${event.title}</span>
            <p>${event.description}</p>
        </div>
        <div class="card-action">
            <p>10/${event.max_participants} places left</p>
            <button data-target="modalEvent" data-event=${event.id} class="btn btn-event btn-general modal-trigger">MORE</button>`;
        eventsCardsDiv.innerHTML+=eventCardTemplate;
    }
})

//ADDING EVENT

var btnRegisterEvent = document.querySelector('#btnRegisterEvent');
btnRegisterEvent.addEventListener('click', function(){
    var geocoder, latlng;
    var address = document.querySelector("#location").value;

    //we first turn the address into lat/lng
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var lat = results[0].geometry.location.lat(); 
            var lng = results[0].geometry.location.lng(); 
            latlng = [lat, lng];
            console.log(latlng);
            var locationData = {
                "name":address,
                "location":{
                    "type":"Point",
                    "coordinates":latlng
                }
            }
            //then we add the location data to the database
            $.ajax({
                method: "POST",
                contentType:'application/json',
                url:APIlink+'/events/add/location',
                data:JSON.stringify(locationData)
            }).done(function(data){
                console.log(data);
            })
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    //KEYWORDS
    var keywords = document.querySelector('#event_keywords').value;
    //we turn the keywords from a string to an array
    keywords=keywords.split(',');
    var jKeywords = {
        "list":keywords
    }
    /* var credentials ={
        "upload_preset":'rrr0rrhe',
        "api_key":538954946762286,
        "file":eventPicture,
        "folder":'test/'
    } */

    //then we add then in the database
    $.ajax({
        method: "POST",
        contentType:'application/json',
        url:APIlink+'/events/add/keywords',
        data:JSON.stringify(jKeywords)
    }).done(function(id){
        //we get back the id of the keyword list
        var keywordsId = id;
        document.querySelector("#event_keywords").value=keywordsId; 

        //now we get the picture and upload it to cloudinary
        var eventPicture = document.querySelector("#eventPicture").files[0];
        console.log(eventPicture);

        var newEventData = $('#modalRegisterEvent form').serialize();

        //we send the event data to be added in the database
        $.post(APIlink+"/events/add", newEventData, function(result){
            console.log(result);
        })
    })
})


//STATS CHARTS
var ctxAttendance = document.getElementById('attendanceChart').getContext('2d');
var attendanceChart = new Chart(ctxAttendance, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "attended",
            backgroundColor: '#12181e',
            borderColor: '#A8CCCA',
            data: [0, 10, 5, 2, 20, 30, 45]
        },
        {
            label: "registered",
            backgroundColor: '#A8CCCA',
            borderColor: '#12181e',
            data: [0, 10, 5, 2, 20, 30, 50]
        }]
    },
    options:{
        responsive:true,
        maintainAspectRatio: false
    }
})

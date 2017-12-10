 $(document).ready(function() {

    //INITIALIZING SELECT
    $('select').material_select();
    //INITIALIZING MODAL
    $('#modalEvent').modal();
    $('#modalRegisterEvent').modal();
});


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

document.addEventListener('click', function(e){
            menuNavigation(e);
        
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

//MAP
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('mapEvent'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

//CREATING EVENT CARDS
const APIlink="http://localhost:3000";
const cloudinaryLink="http://res.cloudinary.com/id-exam/image/upload/";
var eventsCardsDiv = document.querySelector("#event-cards");

$.get(APIlink+'/events', function(data){
    var aEvents = data;
    console.log(data);
    for (let i=0;i<aEvents.length;i++){
        var event=aEvents[i];
        var eventCardTemplate=`<div class="card">
        <div class="card-image">
            <img src="${cloudinaryLink+event.image_src}">
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
            <button data-target="modalEvent" class="btn btn-general modal-trigger">MORE</button>`;
        eventsCardsDiv.innerHTML+=eventCardTemplate;
    }
})
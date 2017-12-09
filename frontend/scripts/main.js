 $(document).ready(function() {

    //INITIALIZING SELECT
    $('select').material_select();
    //INITIALIZING MODAL
    $('#modalEvent').modal();
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

//MAP
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('mapEvent'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}
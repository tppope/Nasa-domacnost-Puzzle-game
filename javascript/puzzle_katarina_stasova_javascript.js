let name_picture = [
    "floor",
    "left_wall",
    "middle_table",
    "middle_wall",
    "next_to_sofa",
    "right_wall",
    "sofa",
    "under_tv",
    "upper_wall",
    "wardrobe",
    "window"];

let right_places = [
    ["76.5%", "26.8%"],
    ["0%", "0"],
    ["66.7%", "43.9%"],
    ["7.1%", "22.9%"],
    ["70.7%", "0%"],
    ["0%", "76.6%"],
    ["57.8%", "0"],
    ["65.5%", "71%"],
    ["0", "18.3%"],
    ["15.5%", "72.4%"],
    ["19%", "32.2%"]
];

let wrong_places = [
    ["120%", "-35%"],
    ["0%", "110%"],
    ["0%", "-25%"],
    ["40%", "-60%"],
    ["0%", "140%"],
    ["50%", "135%"],
    ["120%", "40%"],
    ["0%", "-60%"],
    ["107%", "40%"],
    ["110%", "-55%"],
    ["115%", "105%"]
];

let wrong_places_mobile = [
    ["247%", "30%"],
    ["165%", "50%"],
    ["105%", "-3%"],
    ["103%", "48%"],
    ["103%", "21%"],
    ["180%", "80%"],
    ["240%", "-5%"],
    ["200%", "10%"],
    ["273%", "41%"],
    ["135%", "34%"],
    ["135%", "-5%"]
];

$(window).on("load",function (){
    stopDraggable();
});

function stopDraggable(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.draggable = false;
        if ($( element ).hasClass("ui-draggable"))
            $( element ).draggable( "option", "disabled", true );
    }
}

function setDragAndDrop(name,right_place){
    let draggableImage = document.getElementById(name);
    draggableImage.draggable = true;
    $( draggableImage ).draggable({
        revert: "invalid",
        disabled: false,
        start: function (){
            draggableImage.style.zIndex = "1";
        },
        stop: function (){
            draggableImage.style.zIndex = "0";
        }
    });

    $( "#"+name+"_droppable" ).droppable({
        accept: "#"+name,
        tolerance: "fit",
        drop: function(){
            draggableImage.style.transition = "all 1s";
            changePosition(draggableImage,right_place);
            $( draggableImage ).draggable( "option", "disabled", true);
            draggableImage.draggable = false;
            if(isRightPosition()){
                pause();
                document.querySelector(".modal-body-center").textContent = "Dokončili ste puzzle s časom " + document.getElementById("display").textContent;
                $('#exampleModalCenter').modal({
                    keyboard: false
                });
            }
        }
    });
}

function playDemo(){
    setTimeout(change_reset_button,1);
    setTimeout(stopDraggable,20);
    startPlace();
    setTimeout(turnOnTransition,80);
    setTimeout(setRightPlace,100);
}

function startPlace(){
    setTimeout(turnOffTransition,40);
    setTimeout(setWrongPlace,60);
}

function play(){
    change_start_button();
    startPlace();
    for(let i = 0; i<name_picture.length; i++){
        setDragAndDrop(name_picture[i],right_places[i]);
    }}

function changePosition(element,place){
    element.style.top = place[0];
    element.style.left = place[1];
}

function change_start_button(){
    let start_button = document.getElementById("start_button");
    if ($(start_button).hasClass("btn-outline-success")){
        start();
        start_button.classList.remove("btn-outline-success");
        start_button.classList.add("btn-outline-danger");
        start_button.innerText = "Reset";
    }
    else{
        reset();
        start();
    }
}

function change_reset_button(){
    let start_button = document.getElementById("start_button");
    if ($(start_button).hasClass("btn-outline-danger")){
        start_button.classList.remove("btn-outline-danger");
        start_button.classList.add("btn-outline-success");
        start_button.innerText = "Start";
        reset();
    }
}

function setWrongPlace(){

    let mediaQuery = window.matchMedia("(max-width: 768px)");

    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        if(mediaQuery.matches)
                changePosition(element,wrong_places_mobile[i]);
        else
                changePosition(element,wrong_places[i]);
    }
}

function setRightPlace(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        changePosition(element,right_places[i]);
    }
}

function turnOffTransition(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.style.transition = "all 0s";
        element.style.transitionDelay = "0s";
    }
}

function turnOnTransition(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.style.transition = "all 1s";
        element.style.transitionDelay = i + "s";
    }
}

function isRightPosition(){
    let draggable = true;
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        if (element.draggable === true)
            draggable = false;
    }
    return draggable;
}



//STOPKY

function timeToString(time){
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below
let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML
function print(txt){
    document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions
function start(){
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime(){
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 10);
}

function pause(){
    clearInterval(timerInterval);
}

function reset(){
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
}
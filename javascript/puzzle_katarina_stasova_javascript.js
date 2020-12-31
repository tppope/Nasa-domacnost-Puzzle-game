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

let endPositionPicture = [
    ["76.5%", "26.8%"],
    ["0%", "0%"],
    ["66.7%", "43.9%"],
    ["7.1%", "22.9%"],
    ["70.7%", "0%"],
    ["0%", "76.6%"],
    ["57.8%", "0%"],
    ["65.5%", "71%"],
    ["0%", "18.3%"],
    ["15.5%", "72.4%"],
    ["19%", "32.2%"]
];

let startPositionPicture = [
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

let startPositionPictureMobile = [
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
    draggableFalse();
});

function startDemo(){
    setTimeout(change_reset_button,1);
    setTimeout(draggableFalse,20);
    beginningPicturesPosition();
    setTimeout(makeDemo,80);
    setTimeout(setEndPosition,100);
}


function startGame(){
    change_start_button();
    beginningPicturesPosition();
    for(let i = 0; i<name_picture.length; i++){
        let draggableImage = document.getElementById(name_picture[i]);
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

        $( "#"+name_picture[i]+"Drop" ).droppable({
            accept: "#"+name_picture[i],
            tolerance: "fit",
            drop: function(){
                draggableImage.style.transition = "all 1s";
                changePosition(draggableImage,endPositionPicture[i]);
                $( draggableImage ).draggable( "option", "disabled", true);
                draggableImage.draggable = false;
                if(isRightPosition()){
                    EndPosition();
                }
            }
        });
    }}

function EndPosition(){
    pause();
    document.querySelector(".modal-body-center").textContent = "Dokončili ste puzzle s časom " + document.getElementById("display").textContent;
    $('#exampleModalCenter').modal({
        keyboard: false
    });
}

function beginningPicturesPosition(){
    setTimeout(EndDemo,40);
    setTimeout(setStartPozition,60);
}

function draggableFalse(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.draggable = false;
    }
}

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


function setEndPosition(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        changePosition(element,endPositionPicture[i]);
    }
}


function setStartPozition(){

    let mediaQuery = window.matchMedia("(max-width: 768px)");

    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        if(mediaQuery.matches)
            changePosition(element,startPositionPictureMobile[i]);
        else
            changePosition(element,startPositionPicture[i]);
    }
}

function EndDemo(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.style.transition = "all 0s";
        element.style.transitionDelay = "0s";
    }
}

function makeDemo(){
    for(let i = 0; i<name_picture.length; i++){
        let element = document.getElementById(name_picture[i]);
        element.style.transition = "all 1s";
        element.style.transitionDelay = i + "s";
    }
}

function isRightPosition(){
    for(let i = 0; i<name_picture.length; i++) {
        if(document.getElementById(name_picture[i]).style.top !== endPositionPicture[i][0])
            return false;
    }
    return true;
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

function reset(){
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
}

function pause(){
    clearInterval(timerInterval);
}

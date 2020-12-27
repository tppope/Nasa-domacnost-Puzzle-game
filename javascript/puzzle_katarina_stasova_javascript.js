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

let mediaQuery = window.matchMedia("(max-width: 768px)");
let mediaQueryChange = false;
mediaQuery.addListener(mediaQueryPuzzle);

function settingMediaQueryChangeTrue(){
    mediaQueryChange = true;
}
function settingMediaQueryChangeFalse(){
    mediaQueryChange = false;
}

function mediaQueryPuzzle (){
    setTimeout(settingMediaQueryChangeTrue,70);
    setTimeout(setWrongPlace,80);
}

$(window).on("load",function (){
    cancelDragAndDrop();
});

function dragAndDrop(){
    setDragAndDrop("floor",right_places[0]);
    setDragAndDrop("left_wall",right_places[1]);
    setDragAndDrop("middle_table",right_places[2]);
    setDragAndDrop("middle_wall",right_places[3]);
    setDragAndDrop("next_to_sofa",right_places[4]);
    setDragAndDrop("right_wall",right_places[5]);
    setDragAndDrop("sofa",right_places[6]);
    setDragAndDrop("under_tv",right_places[7]);
    setDragAndDrop("upper_wall",right_places[8]);
    setDragAndDrop("wardrobe",right_places[9]);
    setDragAndDrop("window",right_places[10]);

};

function cancelDragAndDrop(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        element.draggable = false;
        if ($( element ).hasClass("ui-draggable"))
            $( element ).draggable( "option", "disabled", true );
    })
}

function setDragAndDrop(name,right_place){
    let draggableImage = document.getElementById(name+"_draggable");
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
        accept: "#"+name+"_draggable",
        tolerance: "fit",
        drop: function( event, ui ){
            draggableImage.style.transition = "all 1s";
            changePosition(draggableImage,right_place);
            $( draggableImage ).draggable( "option", "disabled", true);
            draggableImage.draggable = false;
            if(checkAllDropped()){
                endGame();
            }
        }
    });
}

function playDemo(){
    setTimeout(change_reset_button(),1);
    setTimeout(cancelDragAndDrop(),10);
    startPlace();
    setTimeout(turnOnTransition,50);
    setTimeout(setRightPlace,60);
}

function startPlace(){
    setTimeout(settingMediaQueryChangeFalse,20)
    setTimeout(turnOffTransition,30);
    setTimeout(setWrongPlace,40);
}

function play(){
    change_start_button();
    startPlace();
    dragAndDrop();
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

function setWrongPlace(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        if(mediaQuery.matches){
            if(mediaQueryChange){
                if(element.draggable === true)
                    changePosition(element,wrong_places_mobile[index]);
            }
            else
                changePosition(element,wrong_places_mobile[index]);
        }
        else{
            if(mediaQueryChange){
                if(element.draggable === true)
                    changePosition(element,wrong_places[index]);
            }
            else
                changePosition(element,wrong_places[index]);
        }
    })
}

function setRightPlace(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        changePosition(element,right_places[index]);
    })
}

function turnOffTransition(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        element.style.transition = "all 0s";
        element.style.transitionDelay = "0s";
    })
}

function turnOnTransition(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        element.style.transition = "all 1s";
        element.style.transitionDelay = index + "s";
    })
}

function checkAllDropped(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    let draggable = true;
    Array.from(images).forEach(function (element, index){
        if (element.draggable === true)
            draggable = false;
    })
    return draggable;
}

function endGame(){
    pause();
    showModal();
}

function showModal(){
    document.querySelector(".modal-body-center").textContent = "Dokončili ste puzzle s časom " + document.getElementById("display").textContent;
    $('#exampleModalCenter').modal({
        keyboard: false
    });
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
let floor_right_place = ["70%", "0"];
let night_table_right_place = ["54%", "0"];
let bed_right_place = ["60.4%", "12.8%"];
let pillows_right_place = ["53%", "15.3%"];
let upper_bed_right_place = ["37.2%", "8.5%"];
let left_wall_right_place = ["0", "0"];
let upper_wall_right_place = ["0", "20.2%"];
let missing_wall_right_place = ["17.2%", "46.5%"];
let right_wall_right_place = ["43%", "52%"];
let right_upper_wall_right_place = ["2.5%", "51.5%"];

let right_places = [floor_right_place,night_table_right_place,bed_right_place,pillows_right_place,upper_bed_right_place,
    left_wall_right_place, upper_wall_right_place, missing_wall_right_place, right_wall_right_place,right_upper_wall_right_place];

let floor_wrong_place = ["120%", "-60%"];
let night_table_wrong_place = ["10%", "-50%"];
let bed_wrong_place = ["127%", "100%"];
let pillows_wrong_place = ["50%", "-55%"];
let upper_bed_wrong_place = ["70%", "110%"];
let left_wall_wrong_place = ["3%", "106%"];
let upper_wall_wrong_place = ["105%", "40%"];
let missing_wall_wrong_place = ["5%", "-20%"];
let right_wall_wrong_place = ["127%", "45%"];
let right_upper_wall_wrong_place = ["65%", "-55%"];

let wrong_places = [floor_wrong_place,night_table_wrong_place,bed_wrong_place,pillows_wrong_place,upper_bed_wrong_place,
    left_wall_wrong_place,upper_wall_wrong_place,missing_wall_wrong_place,right_wall_wrong_place,right_upper_wall_wrong_place];

let floor_wrong_place_mobile = ["170%", "0"];
let night_table_wrong_place_mobile = ["145%", "10%"];
let bed_wrong_place_mobile = ["127%", "48%"];
let pillows_wrong_place_mobile = ["160%", "30%"];
let upper_bed_wrong_place_mobile = ["253%", "10%"];
let left_wall_wrong_place_mobile = ["203%", "50%"];
let upper_wall_wrong_place_mobile = ["105%", "25%"];
let missing_wall_wrong_place_mobile = ["140%", "-3%"];
let right_wall_wrong_place_mobile = ["110%", "-4%"];
let right_upper_wall_wrong_place_mobile = ["200%", "-3%"];

let wrong_places_mobile = [floor_wrong_place_mobile,night_table_wrong_place_mobile,bed_wrong_place_mobile,pillows_wrong_place_mobile,upper_bed_wrong_place_mobile,
    left_wall_wrong_place_mobile,upper_wall_wrong_place_mobile,missing_wall_wrong_place_mobile,right_wall_wrong_place_mobile,right_upper_wall_wrong_place_mobile];

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
    setDragAndDrop("floor",floor_right_place);
    setDragAndDrop("night_table",night_table_right_place);
    setDragAndDrop("bed",bed_right_place);
    setDragAndDrop("pillows",pillows_right_place);
    setDragAndDrop("upper_bed",upper_bed_right_place);
    setDragAndDrop("left_wall",left_wall_right_place);
    setDragAndDrop("upper_wall",upper_wall_right_place);
    setDragAndDrop("missing_wall",missing_wall_right_place);
    setDragAndDrop("right_wall",right_wall_right_place);
    setDragAndDrop("right_upper_wall",right_upper_wall_right_place);
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
    document.querySelector(".modal-body").textContent = "Dokončili ste puzzle s časom " + document.getElementById("display").textContent;
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
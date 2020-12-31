let right_places = {
    floor: ["70%", "0"],
    night_table: ["54%", "0"],
    bed: ["60.4%", "12.8%"],
    pillows: ["53%", "15.3%"],
    upper_bed: ["37.2%", "8.5%"],
    left_wall: ["0", "0"],
    upper_wall: ["0", "20.2%"],
    missing_wall: ["17.2%", "46.5%"],
    right_wall: ["43%", "52%"],
    right_upper_wall: ["2.5%", "51.5%"],
};

let wrong_places = {
    floor: ["120%", "-60%"],
    night_table: ["10%", "-50%"],
    bed: ["127%", "100%"],
    pillows: ["50%", "-55%"],
    upper_bed: ["70%", "110%"],
    left_wall: ["3%", "106%"],
    upper_wall: ["105%", "40%"],
    missing_wall: ["5%", "-20%"],
    right_wall: ["127%", "45%"],
    right_upper_wall: ["65%", "-55%"],
};

let wrong_places_mobile = {
    floor: ["170%", "0"],
    night_table: ["145%", "10%"],
    bed: ["127%", "48%"],
    pillows: ["160%", "30%"],
    upper_bed: ["253%", "10%"],
    left_wall: ["203%", "50%"],
    upper_wall: ["105%", "25%"],
    missing_wall: ["140%", "-3%"],
    right_wall: ["110%", "-4%"],
    right_upper_wall: ["200%", "-3%"],
};

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
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element){
        setDragAndDrop(element,right_places[element.id]);
    })
}

function cancelDragAndDrop(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element, index){
        element.draggable = false;
        if ($( element ).hasClass("ui-draggable"))
            $( element ).draggable( "option", "disabled", true );
    })
}

function setDragAndDrop(draggableImage,right_place){
    console.log(typeof draggableImage.id);
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

    $( "#"+draggableImage.id+"_droppable" ).droppable({
        accept: "#"+draggableImage.id,
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
    setTimeout(change_reset_button,1);
    setTimeout(cancelDragAndDrop,20);
    setTimeout(settingMediaQueryChangeFalse,40)
    startPlace();
    setTimeout(turnOnTransition,100);
    setTimeout(setRightPlace,120);
}

function startPlace(){
    setTimeout(turnOffTransition,60);
    setTimeout(setWrongPlace,80);
}

function play(){
    change_start_button();
    dragAndDrop();
    startPlace();
}

function changePosition(element,place){
    element.style.top = place[0];
    element.style.left = place[1];
}

function change_start_button(){
    let start_button = document.getElementById("start_button");
    if ($(start_button).hasClass("btn-outline-success")){
        start_button.classList.remove("btn-outline-success");
        start_button.classList.add("btn-outline-danger");
        start_button.innerText = "Reset";
    }
    else
        reset();

    start();
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
    Array.from(images).forEach(function (element){

        if (mediaQueryChange){
            if(element.draggable === false)
                return;
        }
        if(mediaQuery.matches)
            changePosition(element,wrong_places_mobile[element.id]);
        else
            changePosition(element,wrong_places[element.id]);
    })
}

function setRightPlace(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element){
        changePosition(element,right_places[element.id]);
    })
}

function turnOffTransition(){
    let puzzle = document.getElementById("puzzle_space");
    let images = puzzle.getElementsByTagName("img");
    Array.from(images).forEach(function (element){
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
    Array.from(images).forEach(function (element){
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

let startTime;
let elapsedTime = 0;
let timerInterval;

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

function print(txt){
    document.getElementById("display").innerHTML = txt;
}

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
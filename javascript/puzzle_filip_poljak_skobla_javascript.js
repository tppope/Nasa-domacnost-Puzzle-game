let left_floor_right_place = ["77.5%", "0"];
let right_floor_right_place = ["69.85%", "44.8%"];
let left_wall_right_place = ["0%", "0%"];
let right_wall_right_place = ["2%", "53.5%"];
let night_table_right_place = ["50%", "0%"];
let pillows_right_place = ["78.7%", "31.4%"];
let table_right_place = ["43.7%", "68.4%"];
let bed_right_place = ["46%", "15.8%"];
let cupboard_right_place = ["21.9%", "48%"];
let roof_right_place = ["0%", "13.5%"];

let left_floor_wrong_place = ["120%", "40%"];
let right_floor_wrong_place = ["0%", "102%"];
let left_wall_wrong_place = ["40%", "105%"];
let right_wall_wrong_place = ["0%", "-55%"];
let night_table_wrong_place = ["110%", "130%"];
let pillows_wrong_place = ["70%", "-25%"];
let table_wrong_place = ["110%", "90%"];
let bed_wrong_place = ["110%", "-20%"];
let cupboard_wrong_place = ["65%", "-55%"];
let roof_wrong_place = ["105%", "0%"];

$(window).on("load",function () 
{
    removeDragAndDrop();
});

/*** Nastavenie DaD podla spravnej pozicie ***/

function createDragAndDropForImage()
{
    setDragAndDrop("left_floor",left_floor_right_place);
    setDragAndDrop("right_floor",right_floor_right_place);
    setDragAndDrop("left_wall",left_wall_right_place);
    setDragAndDrop("right_wall",right_wall_right_place);
    setDragAndDrop("night_table",night_table_right_place);
    setDragAndDrop("pillows",pillows_right_place);
    setDragAndDrop("table",table_right_place);
    setDragAndDrop("bed",bed_right_place);
    setDragAndDrop("cupboard",cupboard_right_place);
    setDragAndDrop("roof",roof_right_place);
};

/*** Nastavenie DaD ***/

function setDragAndDrop(name,right_place) 
{
    document.getElementById(name+"_draggable").draggable = true;
    $( "#"+name+"_draggable" ).draggable({
        revert: "invalid",
        disabled: false,
        start: function (){
            document.getElementById(name+"_draggable").style.zIndex = "1";
        },
        stop: function (){
            document.getElementById(name+"_draggable").style.zIndex = "0";
        }
    });

    $( "#"+name+"_droppable" ).droppable({
        accept: "#"+name+"_draggable",
        tolerance: "fit",
        drop: function( event, ui ) {
            document.getElementById(name+"_draggable").style.transition = "all 0.5s";
            positioning(name,right_place);
            $( "#"+name+"_draggable" ).draggable( "option", "disabled", true );
            document.getElementById(name+"_draggable").draggable = false;
            if(checkImageCompleted()){
                gameEnding();
            }
        }
    });
}

/*** Zakazanie DaD ***/

function removeDragAndDrop()
{
    let puzzleBoard = document.getElementById("puzzleGameBoard");
    let img = puzzleBoard.getElementsByTagName("img");
    jQuery.each(img,function(index,imageElement){
        imageElement.draggable = false;
        if ($( imageElement ).hasClass("ui-draggable"))
            $( imageElement ).draggable( "option", "disabled", true );
    });

}

/*** Funkcia na zacatie hranie hry ***/
function play()
{
    change_start_button();
    setTimeout(removeTransition,100);
    setTimeout(setWrongPlace,150);
    createDragAndDropForImage();
}

/*** Funkcia na zobrazenie dema ***/

function demo()
{
    setTimeout(change_reset_button,10);
    setTimeout(removeDragAndDrop,50);
    setTimeout(removeTransition,100);
    setTimeout(setWrongPlace,150);
    setTimeout(setTransition,200);
    setTimeout(setRightPlace,250);
}

/*** Funkcia na nastavenie pozicie ***/

function positioning(name,position_place)
{
    document.getElementById(name+"_draggable").style.top = position_place[0];
    document.getElementById(name+"_draggable").style.left = position_place[1];
}

/*** Nastavenie spravnej pozicie ***/

function setRightPlace() 
{
    positioning("left_floor",left_floor_right_place);
    positioning("right_floor",right_floor_right_place);
    positioning("left_wall",left_wall_right_place);
    positioning("right_wall",right_wall_right_place);
    positioning("night_table",night_table_right_place);
    positioning("pillows",pillows_right_place);
    positioning("table",table_right_place);
    positioning("bed",bed_right_place);
    positioning("cupboard",cupboard_right_place);
    positioning("roof",roof_right_place);
}

/*** Nastavenie zlej pozicie ***/

function setWrongPlace() 
{
    positioning("left_floor",left_floor_wrong_place);
    positioning("right_floor",right_floor_wrong_place);
    positioning("left_wall",left_wall_wrong_place);
    positioning("right_wall",right_wall_wrong_place);
    positioning("night_table",night_table_wrong_place);
    positioning("pillows",pillows_wrong_place);
    positioning("table",table_wrong_place);
    positioning("bed",bed_wrong_place);
    positioning("cupboard",cupboard_wrong_place);
    positioning("roof",roof_wrong_place);
}

/*** Nastavenie prechodu ***/

function setTransition() 
{
    let puzzleBoard = document.getElementById("puzzleGameBoard");
    let img = puzzleBoard.getElementsByTagName("img");

    jQuery.each(img,function(index,imageElement){
        imageElement.style.transition = "all 1.2s";
        imageElement.style.transitionDelay = index + "s";
    });
}

/*** Zrusenie prechodu ***/

function removeTransition() 
{
    let puzzleBoard = document.getElementById("puzzleGameBoard");
    let img = puzzleBoard.getElementsByTagName("img");
    jQuery.each(img,function(index,imageElement){
        imageElement.style.transition = "all 0s";
        imageElement.style.transitionDelay = "0s";
    });
}

/*** Kontrola spravnosti kompletneho obrazka ***/

function checkImageCompleted()
{
    let draggable = true;
    let puzzleBoard = document.getElementById("puzzleGameBoard");
    let img = puzzleBoard.getElementsByTagName("img");
    jQuery.each(img,function(index,imageElement){
        if (imageElement.draggable === true)
        {
            draggable = false;
        }
    });
    return draggable;
}


/***  Koniec hry ***/

function gameEnding()
{
    clearInterval(timerInterval);
    document.querySelector(".modal-body-center").innerHTML = "Výsledný čas dokončenia puzzle je:  " + document.getElementById("display").textContent;
    $('#exampleModalCenter').modal({
        keyboard: false
    });
}

/*** Stopky ***/

function timeToString(time) 
{
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


let startTime;
let elapsedTime = 0;
let timerInterval;


function start() 
{
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("display").innerHTML = timeToString(elapsedTime);
    }, 10);
}

function reset() 
{
    clearInterval(timerInterval);
    document.getElementById("display").innerHTML = "00:00:00";
    elapsedTime = 0;
}

/*** Prepinanie tlacidla START/RESET ***/

function change_start_button() 
{
    let start_button = document.getElementById("start_button");
    if ($(start_button).hasClass("btn-outline-success"))
    {
        start();
        start_button.classList.remove("btn-outline-success");
        start_button.classList.add("btn-outline-danger");
        start_button.innerText = "Reset";
    }
    else 
    {
        reset();
        start();
    }
}

function change_reset_button() 
{
    let start_button = document.getElementById("start_button");
    if ($(start_button).hasClass("btn-outline-danger"))
    {
        start_button.classList.remove("btn-outline-danger");
        start_button.classList.add("btn-outline-success");
        start_button.innerText = "Start";
        reset();
    }
}
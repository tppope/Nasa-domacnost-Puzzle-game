let obrazky = {
    "lava-stena": {
        insideXY: [0, 0],
        outsideXY: [-500, 0],
        width: 405,
        height: 620
    },
    "strop": {
        insideXY: [256, 0],
		outsideXY: [-80, 720],
        width: 450,
        height: 250
    },
    "prava-stena": {
        insideXY: [597, 0],
		outsideXY: [900, -100],
        width: 250,
        height: 700
    },
    "zadna-stena": {
        insideXY: [401, 222],
		outsideXY: [-230, 480],
        width: 220,
        height: 240
    },
    "dvere": {
        insideXY: [452, 262],
		outsideXY: [-350, 200],
        width: 80,
        height: 180
    },
    "podlaha": {
        insideXY: [305, 423],
		outsideXY: [-500, 700],
        width: 440,
        height: 280
    },
    "policka": {
        insideXY: [0, 316],
		outsideXY: [900, 430],
        width: 440,
        height: 380
    },
    "zrkadlo": {
        insideXY: [89, 79],
		outsideXY: [500, 720],
        width: 210,
        height: 490
    }
};

let
    timeoutTimers = [],
    placedCount = 0;



function createPuzzlePieces() {
    let puzzleDiv = $("#chodba_puzzle");
    for (let nazov in obrazky) {
        let dynamicStyle = `
            left:` + (obrazky[nazov].insideXY[0] - 10) + `px;
            top:` + (obrazky[nazov].insideXY[1] - 10) + `px;
            width:` + (obrazky[nazov].width + 20) + `px;
            height:` + (obrazky[nazov].height + 20) + `px;
        `;

        puzzleDiv.append(
            '<img src="casti-puzzle/' + nazov + '.png" alt="' + nazov + '" class="puzzle-cast" id="piece-' + nazov + '">' + 
            '<div id="piece-' + nazov + '-container" style="' + dynamicStyle + '" class="puzzle-cast-container"></div>'
        );
    }
}



function placeImageInside(nazov) {
    $("#piece-" + nazov).css({
        left: obrazky[nazov].insideXY[0] + "px",
        top: obrazky[nazov].insideXY[1] + "px"
    });
}

function placeInside() {
    for (let nazov in obrazky) placeImageInside(nazov);
}

function placeInsideWithDelay() {
    let counter = 1;
    for (let nazov in obrazky) {
        timeoutTimers.push(
            setTimeout(
                function() {
                    placeImageInside(nazov);
                },
                1000 * counter
            )
        );
        counter++;
    }
}

function placeOutside() {
    for (let nazov in obrazky) {
        $("#piece-" + nazov).css({
            left: obrazky[nazov].outsideXY[0] + "px",
            top: obrazky[nazov].outsideXY[1] + "px"
        });
    }
}


function transitionSetup(turnOn) {
    let timeCoefficient = 1 * turnOn;

    Array.from( $("#chodba_puzzle img") ).forEach(function(element, index) {
        $(element).css({
            transition: "all " + timeCoefficient + "s",
            transitionDelay: (index * timeCoefficient) + "s"
        });
    });
}

function dragAndDropDisable() {
    Array.from( $("#chodba_puzzle img") ).forEach(function (element, index) {
        element.draggable = false;
        $(element).draggable("option", "disabled", true);
    });
}

function dragAndDropEnable() {
    Array.from( $("#chodba_puzzle img") ).forEach(function (element, index) {
        element.draggable = true;

        let nazov = $(element).attr("alt");

        $('#piece-' + nazov).draggable({
            revert: "invalid",
            disabled: false
        });

        $('#piece-' + nazov + '-container').droppable({
            accept: '#piece-' + nazov,
            tolerance: "fit",
            drop: function( event, ui ) {
                placeImageInside(nazov);

                let kusok = $('#piece-' + nazov);
                $('#piece-' + nazov + '-container').css("z-index", "-1");
                kusok.draggable = false;
                $(kusok).draggable("option", "disabled", true);

                placedCount++;

                if (checkEndGame()) {
                    endGame();
                }
            }
        });
    });
}



function checkEndGame() {
    return placedCount == 8;
}


function endGame() {

}



function clearTimers() {
    for (t in timeoutTimers) {
        clearTimeout(timeoutTimers[t]);
    }
    timeoutTimers = [];
}


function runDemo() {
    transitionSetup(turnOn = 0);
    clearTimers();

    placeOutside();

    setTimeout(
        function() {
            transitionSetup(turnOn = 1);
            placeInsideWithDelay();
        },
        100
    );
}


function play() {
    placedCount = 0;
    transitionSetup(turnOn = 0);
    clearTimers();
    dragAndDropEnable();
    placeOutside();
}


$(document).ready(function(){
    createPuzzlePieces();
    
    placeInside();
});
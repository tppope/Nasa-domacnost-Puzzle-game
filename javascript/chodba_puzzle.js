let obrazky = {
    "lava-stena": {
        insideXY: [0, 0],
		outsideXY: [-500, 0]
    },
    "strop": {
        insideXY: [256, 0],
		outsideXY: [-80, 720]
    },
    "prava-stena": {
        insideXY: [597, 0],
		outsideXY: [900, -100]
    },
    "zadna-stena": {
        insideXY: [401, 222],
		outsideXY: [-230, 480]
    },
    "dvere": {
        insideXY: [452, 262],
		outsideXY: [-350, 200]
    },
    "podlaha": {
        insideXY: [305, 423],
		outsideXY: [-500, 700]
    },
    "policka": {
        insideXY: [0, 316],
		outsideXY: [900, 430]
    },
    "zrkadlo": {
        insideXY: [89, 79],
		outsideXY: [500, 720]
    }
};

function createPuzzlePieces() {
    let puzzleDiv = $("#chodba_puzzle");
    for (let nazov in obrazky) {
        puzzleDiv.append('<img src="casti-puzzle/' + nazov + '.png" alt="' + nazov + '" class="puzzle-cast" id="piece-' + nazov + '">');
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
        setTimeout(
            function() {
                placeImageInside(nazov);
            },
            1000 * counter
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

function runDemo() {
    transitionSetup(turnOn = 0);
    placeOutside();
    setTimeout(
        function() {
            transitionSetup(turnOn = 1);
            placeInsideWithDelay();
        },
        100
    );
}


$(document).ready(function(){
    createPuzzlePieces();
    
    placeInside();
});
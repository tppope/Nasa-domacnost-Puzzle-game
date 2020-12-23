let obrazky = {
    "dvere": {
        rightXY: [452, 262]
    },
    "lava-stena": {
        rightXY: [0, 0]
    },
    "podlaha": {
        rightXY: [305, 423]
    },
    "policka": {
        rightXY: [0, 316]
    },
    "prava-stena": {
        rightXY: [597, 0]
    },
    "strop": {
        rightXY: [256, 0]
    },
    "zadna-stena": {
        rightXY: [401, 222]
    },
    "zrkadlo": {
        rightXY: [89, 79]
    }
};


$(document).ready(function(){
    let puzzleDiv = $("#chodba_puzzle");
    for (nazov in obrazky) {
        let cssDynamicStyle = `
            left: ` + obrazky[nazov].rightXY[0]  + `px;
            top: ` + obrazky[nazov].rightXY[1]  + `px;
        `;

        puzzleDiv.append('<img src="casti-puzzle/' + nazov + '.png" alt="' + nazov + '" class="puzzle-cast" style="' + cssDynamicStyle + '">');
    }
});
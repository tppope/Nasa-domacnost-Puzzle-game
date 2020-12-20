$( function() {
    $( "#floor_draggable" ).draggable({ revert: "invalid" });

    $( "#floor_droppable" ).droppable({
        accept: "#floor_draggable",
        drop: function( event, ui ) {
            document.getElementById("floor_draggable").style.transition = "all 1s";
            document.getElementById("floor_draggable").style.left = "0";
            document.getElementById("floor_draggable").style.top = "70%";

        }
    });
} );

$( function() {
    $( "#night_table_draggable" ).draggable({ revert: "invalid" });

    $( "#night_table_droppable" ).droppable({
        accept: "#night_table_draggable",
        drop: function( event, ui ) {
            document.getElementById("night_table_draggable").style.transition = "all 1s";
            document.getElementById("night_table_draggable").style.left = "0";
            document.getElementById("night_table_draggable").style.top = "54%";
        }
    });
} );
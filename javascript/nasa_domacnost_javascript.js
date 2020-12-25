$(window).on("load",function (){
    var menu=$('#menu');

    fetch('resources/json/menu.json')
        .then(response => response.json())
        .then(json =>  parseMenu(menu, json.menu));
    function parseMenu(ul, menu) {
        for (var i = 0; i < menu.length; i++) {

            var li = $('<li class="dropdown-submenu"><a class="dropdown-item" href="' + menu[i].src + '">' + menu[i].title + '</a></li>').appendTo(ul);

            // If sub menus contain something
            if (menu[i].sub != null) {

                var subul = $('<ul id="submenu-' + menu[i].src + '" class="dropdown-menu"></ul>');
                $(li).append(subul);
                parseMenu($(subul), menu[i].sub);
            }else {
                $(li).removeClass('dropdown-submenu');
            }
        }
    }

    document.getElementById("nebo").style.top = 0 +"%";
    document.getElementById("grass").style.bottom = 0 +"%";

    document.getElementById("middle").style.top = 19 +"%";
    document.getElementById("middle").style.left = 40 +"%";

    document.getElementById("left_up").style.top = 9.5 +"%";
    document.getElementById("left_up").style.left = 15.7 +"%";

    document.getElementById("left_down").style.bottom = 18.3 +"%";
    document.getElementById("left_down").style.left = 0 +"%";

    document.getElementById("right").style.bottom = 22 +"%";
    document.getElementById("right").style.right = 0 +"%";
});
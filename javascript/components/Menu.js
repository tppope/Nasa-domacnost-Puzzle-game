const template = document.createElement("template");
template.innerHTML = `




`;


class Menu extends HTMLElement{
    constructor() {
        super();


    this.attachShadow({node: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

}
window.customElements.define('me-nu', Menu);
//
// $(window).on("load",function (){
//     var menu=$('#menu');
//
//     fetch('resources/json/menu.json')
//         .then(response => response.json())
//          .then(json =>  parseMenu(menu, json.menu));
//     function parseMenu(ul, menu) {
//         for (var i = 0; i < menu.length; i++) {
//
//             var li = $('<li class="dropdown-submenu"><a class="dropdown-item" href="' + menu[i].src + '">' + menu[i].title + '</a></li>').appendTo(ul);
//
//             // If sub menus contain something
//             if (menu[i].sub != null) {
//
//                 var subul = $('<ul id="submenu-' + menu[i].src + '" class="dropdown-menu"></ul>');
//                 $(li).append(subul);
//                 parseMenu($(subul), menu[i].sub);
//             }else {
//                 $(li).removeClass('dropdown-submenu');
//             }
//         }
//     }
//
//
//
//     // $('.dropdown-submenu>a').unbind('click').click(function(e) {
//     //     $(this).next('ul').toggle();
//     //     e.stopPropagation();
//     //     e.preventDefault();
//     // });
//
// });

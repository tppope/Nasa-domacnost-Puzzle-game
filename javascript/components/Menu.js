// const template = document.createElement("template");
// template.innerHTML = `
//
//
//
//
// `;
//
//
// class Menu extends HTMLElement{
//     constructor() {
//         super();
//
//
//     this.attachShadow({node: 'open'});
//     this.shadowRoot.appendChild(template.content.cloneNode(true));
//
//     }
//
// }
// window.customElements.define('me-nu', Menu);
var recursia = 0;
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



    $('.dropdown-submenu>a').unbind('click').click(function(e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

});
//
// $(function() {
//     $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(event) {
//         event.preventDefault();
//         event.stopPropagation();
//
//         //method 1: remove show from sibilings and their children under your first parent
//
//         /* 		if (!$(this).next().hasClass('show')) {
//
//                         $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
//                      }  */
//
//
//         //method 2: remove show from all siblings of all your parents
//         $(this).parents('.dropdown-submenu').siblings().find('.show').removeClass("show");
//
//         $(this).siblings().toggleClass("show");
//
//
//         //collapse all after nav is closed
//         $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
//             $('.dropdown-submenu .show').removeClass("show");
//         });
//
//     });
// });
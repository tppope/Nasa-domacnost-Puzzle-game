const template = document.createElement("template");
template.innerHTML = `

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
    <script src="../jQuery/jquery-3.5.1.min.js"></script>
    <script src="../bootstrap/bootstrap.min.js"></script>
    
    <script src="../nasa_domacnost_javascript.js" defer></script>

    <nav class="navbar navbar-expand-md navbar-light bg-white py-3 shadow-sm">
        <div class="container-fluid">
            <a href="#" class="navbar-brand font-weight-bold">Multilevel Dropdown</a>

            <button type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler">
                <span class="navbar-toggler-icon"></span>
            </button>


            <div id="navbarContent" class="collapse navbar-collapse">

                <ul class="navbar-nav mr-auto" id ="menu">
                </ul>
            </div>
        </div>
    </nav>
        
        <style>
        
            @media screen and (min-width:768px) {
                .navbar-brand-centered {
                    position: absolute;
                    left: 50%;
                    display: block;
                    width: 160px;
                    text-align: center;
                    background-color: #eee;
                }
                .navbar>.container .navbar-brand-centered,
                .navbar>.container-fluid .navbar-brand-centered {
                    margin-left: -80px;
                }
            }
            
            .dropdown-submenu {
                position: relative;
            }
            
            .dropdown-submenu>.dropdown-menu {
                top: 120%;
                left: 0;
                margin-top: -6px;
                margin-left: -1px;
                -webkit-border-radius: 0 6px 6px 6px;
                -moz-border-radius: 0 6px 6px;
                border-radius: 0 6px 6px 6px;
            }
            
            .dropdown-submenu:hover>.dropdown-menu {
                display: block;
            }
            
            .dropdown-submenu>a:after {
                display: block;
                content: " ";
                float: right;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                border-width: 5px 5px 0 5px;
                border-top-color: #ccc;
                margin-top: 10px;
                margin-left: 5px;
                margin-right: -15px;
            }
            
            .dropdown-submenu:hover>a:after {
                border-left-color: #fff;
            }
            
            .dropdown-submenu.pull-left {
                float: none;
            }
            
            .dropdown-submenu.pull-left>.dropdown-menu {
                left: -100%;
                margin-left: 10px;
                -webkit-border-radius: 6px 0 6px 6px;
                -moz-border-radius: 6px 0 6px 6px;
                border-radius: 6px 0 6px 6px;
            }

        </style>


`;


class Menu extends HTMLElement{
    constructor() {
        super();


    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.showMenu();
    }
    showMenu(){
        var ul= this.shadowRoot.getElementById('menu');

        fetch('resources/json/menu.json')
            .then(response => response.json())
            .then(json =>  parseMenu(ul, json.menu));
        function parseMenu(ul, menu) {

            for (var i = 0; i < menu.length; i++) {
                var li = document.createElement("li");
                li.classList.add("dropdown-submenu");
                var a = document.createElement("a");
                a.classList.add("dropdown-item");
                a.setAttribute("href",menu[i].src);
                a.textContent = menu[i].title;
                li.appendChild(a);
                ul.appendChild(li);

                // If sub menus contain something
                if (menu[i].sub != null) {

                    var subul = document.createElement("ul");
                    subul.id = "submenu-" + menu[i].src;
                    subul.classList.add("dropdown-menu");

                    li.appendChild(subul);
                    parseMenu(subul, menu[i].sub);
                }else {
                    li.classList.remove('dropdown-submenu');

                }
            }
        }
    }

}


window.customElements.define('me-nu', Menu);

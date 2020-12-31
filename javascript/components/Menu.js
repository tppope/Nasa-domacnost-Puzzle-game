const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">   
    <script src="javascript/bootstrap/bootstrap.min.js"></script>
    

    <nav class="navbar navbar-expand-md navbar-light py-3">
        <div>
            <button class="navbar-toggler" type="button" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarContent" class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto" id ="menu">
                </ul>
                <web-counter></web-counter>
            </div>
        </div>
    </nav>
        
        <style>
            .navbar{
                background: rgb(255,255,255);
                background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(231,245,255,1) 50%, rgba(255,255,255,1) 100%);
             }
       
            web-counter {
                position:absolute;
                right: 2%;
                font-weight: bold;
                font-family: "Arial",Arial,sans-serif;
                font-size: 15px;
            }  
            .dropdown-submenu {
                position: relative;
            }
            
            .dropdown-submenu>.dropdown-menu {
                top: 118%;
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
                margin-top: 13px;
                margin-left: 5px;
                margin-right: -15px;
            }
            
            .dropdown-submenu:hover>a:after {
                border-top-color: black;
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
            @media (max-width: 768px){
                web-counter {
                position:absolute;
                right: 3px;
                bottom: 3px;
                font-weight: bold;
                font-family: "Arial",Arial,sans-serif;
                font-size: 15px;
                } 
                #navbarContent
                {
                    margin-bottom: 10px;
                }
            }
            a{
                font-size: 19px;
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
        let ul= this.shadowRoot.getElementById('menu');

        fetch('resources/json/menu.json')
            .then(response => response.json())
            .then(json =>  parseMenu(ul, json.menu));
        function parseMenu(ul, menu) {

            for (let i = 0; i < menu.length; i++) {
                let li = document.createElement("li");
                li.classList.add("dropdown-submenu");
                let a = document.createElement("a");
                a.classList.add("dropdown-item");
                a.classList.add("dropdown-item");
                a.setAttribute("href",menu[i].src);
                a.textContent = menu[i].title;
                li.appendChild(a);
                ul.appendChild(li);

                // If sub menus contain something
                if (menu[i].sub != null) {

                    let ul2 = document.createElement("ul");
                    ul2.id = "submenu-" + menu[i].src;
                    ul2.classList.add("dropdown-menu");

                    li.appendChild(ul2);
                    parseMenu(ul2, menu[i].sub);
                }else {
                    li.classList.remove('dropdown-submenu');

                }
            }
        }
    }
    showNavbar() {

        if (this.shadowRoot.querySelector('.show'))
            this.shadowRoot.querySelector('#navbarContent').classList.remove("show");
        else
            this.shadowRoot.querySelector('#navbarContent').classList.add("show");
    }

    connectedCallback() {

        this.shadowRoot.querySelector('.navbar-toggler').addEventListener("click", event => {
            this.showNavbar();
        });
    }



}


window.customElements.define('me-nu', Menu);

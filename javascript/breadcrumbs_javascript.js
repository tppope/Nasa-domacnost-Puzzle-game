
let pages = [
    {"href":"index.html","title":"Domov"},
    {"href":"about_us.html","title":"O Nás"},
    {"href":"puzzle_katarina_stasova.html","title":"Katkina miestnosť"},
    {"href":"puzzle_tomas_popik.html","title":"Tomášova miestnosť"},
    {"href":"puzzle_filip_poljak_skobla.html","title":"Filipova miestnosť"},
    {"href":"puzzle_juraj_zozulak.html","title":"Jurajova miestnosť"},
]

document.addEventListener("DOMContentLoaded",()=>{
    let breadcrumbs = getCookie("breadcrumbs");
    if(breadcrumbs){
        breadcrumbs = JSON.parse(breadcrumbs);
        if(breadcrumbs.length > 4){
            breadcrumbs.shift();
        }
        breadcrumbs.push(pageId);
    }else{
        breadcrumbs = [pageId];
    }

    setCookie("breadcrumbs",JSON.stringify(breadcrumbs),1);
    let breadcrumbParent = document.querySelector(".breadcrumb");

    breadcrumbs.forEach((item,index)=>{
        let breadcrumbElement = document.createElement("li");
        breadcrumbParent.appendChild(breadcrumbElement);

        if(index == breadcrumbs.length-1)
        {
            breadcrumbElement.classList = "breadcrumb-item active";
            breadcrumbElement.append(pages[item].title)
        }else{
            breadcrumbElement.classList = "breadcrumb-item";
            let breadcrumbLink = document.createElement("a");
            breadcrumbLink.setAttribute("href",pages[item].href);
            breadcrumbLink.append(pages[item].title);
            breadcrumbElement.appendChild(breadcrumbLink);
        }

    })
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

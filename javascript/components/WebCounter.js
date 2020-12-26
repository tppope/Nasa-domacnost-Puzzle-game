class WebCounter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});

        this.virtualDOM = {
            webCounterInput: document.createElement("div"),
        };

        this.shadowRoot.innerHTML = this.setCSS();
        this.setBody();
    }

    setCSS(){
        return "<style></style>";
    }

    webCounting(){
        let locStor = window.localStorage;
        let web_counter = locStor.getItem("web_counter");
        let number = 1;
        if (!web_counter)
            locStor.setItem("web_counter", "1");
        else{
            number = Number(web_counter) + 1;
            locStor.setItem("web_counter", number.toString());
        }
        return number.toString();
    }

    setBody(){
        this.virtualDOM.webCounterInput.textContent = "Na našu stránku ste pristúpili "+ this.webCounting()+" krát";
        this.shadowRoot.append(this.virtualDOM.webCounterInput);
    }
}

window.customElements.define('web-counter', WebCounter);

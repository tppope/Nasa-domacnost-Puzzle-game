class Meniny extends HTMLElement {
	constructor() {
		super();

        this.attachShadow({mode: "open"});


        this.virtualDOM = {
            datumInput: null,
            searchInput: null,
            currentDayResult: null,
            resultList: [],
            resultListContainerDiv: document.createElement("div")
        };

        this.shadowRoot.innerHTML = this.setupInnerCSS(); // tadeto sa pridava len CSS kod, HTML kod sa dava ako appendChild

        // v child elementoch sa vykona setup body, kvoli odlisnemu body pre kazdy z child elementov
    }


    setMultipleAttrs(element, attrs) {
        for (let a in attrs) element.setAttribute(a, attrs[a]);
    }



    setupDatumInput() {
        this.virtualDOM.datumInput = document.createElement("input");
        
        this.setMultipleAttrs(this.virtualDOM.datumInput, {
            class: "form-control",
            type: "text",
            placeholder: "31.03. alebo 31.3. bez medzier",
            pattern: "[0-9]{1,2}.[0-9]{1,2}.",
            id: "datum"
        });

        this.virtualDOM.datumInput.addEventListener("change", this.getDatum.bind(this));
    }

    setupSearchInput() {
        this.virtualDOM.searchInput = document.createElement("input");
        
        this.setMultipleAttrs(this.virtualDOM.searchInput, {
            class: "form-control",
            type: "text",
            placeholder: "na diakritike a veľkosti písmen nezáleží",
            id: "datum"
        });

        this.virtualDOM.searchInput.addEventListener("change", this.getSearchResultsXMLWrapper.bind(this));
    }


    setupInnerCSS() {
        return `
        <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
        <style>
            input {
                width: 250px;
            }
        </style>`;
    }


    getDatum() {
        if (!this.virtualDOM.datumInput.checkValidity()) return false;

        let datumSplit = this.virtualDOM.datumInput.value.split(".");
        let datumSearch = {
            den: parseInt(datumSplit[0]),
            mesiac: parseInt(datumSplit[1])
        }

        const meninyXHR = new XMLHttpRequest();

        meninyXHR.open("GET", "zozulak_meniny/meniny-dataset.xml");
        meninyXHR.responseType = "document";
        meninyXHR.send();

        this.virtualDOM.resultList = [];
        
        meninyXHR.onload = this.getResultByDatum.bind(this, meninyXHR, datumSearch, true, true);
        
        meninyXHR.onerror = function() {
            dump("Error while getting XML.");
        }
    
    }



    getSearchResultsXMLWrapper() {
        const meninyXHR = new XMLHttpRequest();

        meninyXHR.open("GET", "zozulak_meniny/meniny-dataset.xml");
        meninyXHR.responseType = "document";
        meninyXHR.send();
        
        meninyXHR.onload = this.getSearchString.bind(this, meninyXHR);
        
        meninyXHR.onerror = function() {
            dump("Error while getting XML.");
        }
    }


    getSearchString(meninyXHR) {
        this.virtualDOM.searchInput.value = this.virtualDOM.searchInput.value.trim();
        if ( this.virtualDOM.searchInput.value.length == 0 ) {
            this.virtualDOM.resultList = [];
            this.showResults.bind(this)();
        }

        else {
            let normalizedSubstring = this.virtualDOM.searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let skratky = ["SKd", "SK", "CZ", "HU", "PL", "AT", "SKdni", "SKsviatky", "CZsviatky"];

            let foundDates = [];


            let zaznamy = Array.from( meninyXHR.responseXML.documentElement.children );
            
            this.virtualDOM.resultList = [];

            for (let a = 0; a < zaznamy.length; a++) {
                let aktZaznamRaw = zaznamy[a].children;


                let aktZaznamData = {};
                for (let b = 0; b < aktZaznamRaw.length; b++) {
                    aktZaznamData[ aktZaznamRaw[b].nodeName ] = aktZaznamRaw[b].innerHTML;
                }


                let currentDatumRaw = aktZaznamData.den.toString();
                let currentDatum = {
                    den: parseInt(currentDatumRaw.substr(2)),
                    mesiac: parseInt(currentDatumRaw.substr(0, 2))
                };


                let found = false;
                for (let skratka of skratky) {
                    let str = aktZaznamData[skratka];
                    if (str != undefined) {
                        let strNormalized = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        found = ( strNormalized.search(normalizedSubstring) != -1 );
                    }

                    if (found) {
                        foundDates.push( currentDatum );
                        break;
                    }
                }
            }

            for (let datum of foundDates) {
                this.getResultByDatum(meninyXHR, datum, true);
            }

            this.showResults.bind(this)();
        }
    }


    setupCurrentDay() {
        let d = new Date();
        let currentDatum = {
            den: d.getDate(),
            mesiac: d.getMonth() + 1
        };
        
        const meninyXHR = new XMLHttpRequest();

        meninyXHR.open("GET", "zozulak_meniny/meniny-dataset.xml");
        meninyXHR.responseType = "document";
        meninyXHR.send();
        
        meninyXHR.onload = this.getResultByDatum.bind(this, meninyXHR, currentDatum);
        
        meninyXHR.onerror = function() {
            dump("Error while getting XML.");
        }
    }

    setupCurrentDayShort() {
        let d = new Date();
        let currentDatum = {
            den: d.getDate(),
            mesiac: d.getMonth() + 1
        };


        const meninyXHR = new XMLHttpRequest();

        meninyXHR.open("GET", "zozulak_meniny/meniny-dataset.xml");
        meninyXHR.responseType = "document";
        meninyXHR.send();
        
        meninyXHR.onload = this.setupCurrentDayShortXMLOnload.bind(this, meninyXHR, currentDatum);
        
        meninyXHR.onerror = function() {
            dump("Error while getting XML.");
        }

        
    }

    setupCurrentDayShortXMLOnload(meninyXHR, currentDatum) {
        let zaznamy = Array.from( meninyXHR.responseXML.documentElement.children );

        let currentDatumTextual = (currentDatum.mesiac < 10 ? "0" + currentDatum.mesiac : currentDatum.mesiac)  + "" + (currentDatum.den < 10 ? "0" + currentDatum.den : currentDatum.den);
        
        for (let a = 0; a < zaznamy.length; a++) {
            let aktZaznamRaw = zaznamy[a].children;


            let aktZaznamData = {};
            for (let b = 0; b < aktZaznamRaw.length; b++) {
                aktZaznamData[ aktZaznamRaw[b].nodeName ] = aktZaznamRaw[b].innerHTML;
            }

            if (aktZaznamData.den == currentDatumTextual) {

                let short = document.createElement("div");
                short.style.display = "inline";

                if (aktZaznamData.SK != undefined) {
                    short.append(
                        "Dnes je " + currentDatum.den + ". " + currentDatum.mesiac + "., meniny má " + aktZaznamData.SK + ". "
                    );
                }

                if (aktZaznamData.SKsviatky != undefined) {
                    short.append(
                        "Dnešný sviatok je " + aktZaznamData.SKsviatky
                    );
                }


                this.virtualDOM.currentDayResult = short;

                this.shadowRoot.append(
                    this.virtualDOM.currentDayResult
                );
            }
        }
    }


    getResultByDatum(meninyXHR, datum, pushToResultList=false, showResults=false) {
        let zaznamy = Array.from( meninyXHR.responseXML.documentElement.children );

        let datumTextual = (datum.mesiac < 10 ? "0" + datum.mesiac : datum.mesiac)  + "" + (datum.den < 10 ? "0" + datum.den : datum.den);
        
        for (let a = 0; a < zaznamy.length; a++) {
            let aktZaznamRaw = zaznamy[a].children;


            let aktZaznamData = {};
            for (let b = 0; b < aktZaznamRaw.length; b++) {
                aktZaznamData[ aktZaznamRaw[b].nodeName ] = aktZaznamRaw[b].innerHTML;
            }

            if (aktZaznamData.den == datumTextual) {

                let br = document.createElement("br");
                let bold = document.createElement("strong");

                let builtResult = document.createElement("div");

                let mesiace = ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"];

                let datumNadpis = bold.cloneNode();
                datumNadpis.append("Dátum: ");

                let setup = [
                    datumNadpis,
                    datum.den + ". " + mesiace[ datum.mesiac - 1 ],
                    br.cloneNode()
                ];


                let skratky = {
                    "SK": "Slovenské meniny",
                    "SKd": "Slovenské meniny v plnom tvare",
                    "CZ": "České meniny",
                    "AT": "Rakúske meniny",
                    "PL": "Poľské meniny",
                    "HU": "Maďarské meniny",
                    "SKdni": "Slovenský pamätný deň",
                    "SKsviatky": "Slovenský sviatok",
                    "CZsviatky": "Český sviatok"
                };

                for (let skratka in skratky) {
                    if (aktZaznamData[skratka] != undefined) {
                        let b = bold.cloneNode();
                        b.append(skratky[skratka] + ": ");

                        setup.push(
                            b,
                            aktZaznamData[skratka],
                            br.cloneNode()
                        );
                    }
                }


                builtResult.append(...setup, br.cloneNode());


                this.virtualDOM.currentDayResult = builtResult;

                this.shadowRoot.append(
                    this.virtualDOM.currentDayResult
                );
                if (pushToResultList) {
                    this.virtualDOM.resultList.push(builtResult);
                }
            }
        }

        if (showResults) {
            this.showResults.bind(this)();
        }
    }


    showResults() {
        // surove premazanie
        this.virtualDOM.resultListContainerDiv.innerHTML = "";

        let br = document.createElement("br");
        this.virtualDOM.resultListContainerDiv.append(
            ...this.virtualDOM.resultList,
            br.cloneNode(), br.cloneNode()
        );
    }
};



class MeninyDnesne extends Meniny {
    constructor() {
        super();
        this.setupElementBody();
    }

    setupElementBody() {
        this.setupCurrentDayShort();
    }
}

class MeninyDnesnePlne extends Meniny {
    constructor() {
        super();
        this.setupElementBody();
    }

    setupElementBody() {
        this.setupCurrentDay();
    }
}

class MeninyVyhladavanie extends Meniny {
    constructor() {
        super();
        this.setupElementBody();
    }

    setupElementBody() {
        this.setupDatumInput();
        this.setupSearchInput();
        
        this.virtualDOM.resultListContainerDiv = document.createElement("div");


        let br = document.createElement("br");

        this.shadowRoot.append(
            "Zadaj dátum: ",
            this.virtualDOM.datumInput,
            br.cloneNode(),
            "Zadaj meno alebo jeho časť: ",
            this.virtualDOM.searchInput,
            br.cloneNode(),
            this.virtualDOM.resultListContainerDiv
        );
    }
}


customElements.define("meniny-vyhladavanie", MeninyVyhladavanie);
customElements.define("meniny-dnesne-plne", MeninyDnesnePlne);
customElements.define("meniny-dnesne", MeninyDnesne);
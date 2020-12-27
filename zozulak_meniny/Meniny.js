class Meniny extends HTMLElement {
	constructor() {
		super();

        this.attachShadow({mode: "open"});


        this.virtualDOM = {
            datumInput: null,
            searchInput: null,
            currentDayResult: null,
            resultList: [],
            resultListContainerDiv: null
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

        this.virtualDOM.searchInput.addEventListener("change", this.getSearchString.bind(this));
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

        this.virtualDOM.resultList = [ this.getResultByDatum(datumSearch) ];
        this.showResults.bind(this)();
    }


    getSearchString() {
        this.virtualDOM.searchInput.value = this.virtualDOM.searchInput.value.trim();
        if ( this.virtualDOM.searchInput.value.length == 0 ) {
            this.virtualDOM.resultList = [];
        }

        else {
            let normalizedSubstring = this.virtualDOM.searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let foundDates = [];

            let br = document.createElement("br");

            let skratky = ["SKd", "SK", "CZ", "HU", "PL", "AT", "SKdni", "SKsviatky", "CZsviatky"];


            for (let datum in MENINY_DATASET_NORMALIZED) {
                let found = false;
                for (let skratka of skratky) {
                    let str = MENINY_DATASET_NORMALIZED[datum][skratka];
                    if (str != undefined) {
                        found = ( str.search(normalizedSubstring) != -1 );
                    }

                    if (found) {
                        foundDates.push(
                            this.getResultByDatum( MENINY_DATASET[datum].den ),
                            br.cloneNode()
                        );
                        break;
                    }
                }
            }

            this.virtualDOM.resultList = foundDates;
        }

        this.showResults.bind(this)();
    }


    setupCurrentDay() {
        let d = new Date();
        let currentDatum = {
            den: d.getDate(),
            mesiac: d.getMonth() + 1
        };
        
        this.virtualDOM.currentDayResult = this.getResultByDatum(currentDatum);
    }

    setupCurrentDayShort() {
        let d = new Date();
        let currentDatum = {
            den: d.getDate(),
            mesiac: d.getMonth() + 1
        };
        
        let md = MENINY_DATASET[ currentDatum.mesiac + "-" + currentDatum.den ];

        let br = document.createElement("br");


        let short = document.createElement("div");
        short.style.display = "inline";

        short.append(
            "Dnes je " + currentDatum.den + ". " + currentDatum.mesiac + "., meniny má " + md.SK
        );

        if (md.SKsviatky != undefined) {
            short.append(
                ", dnešný sviatok je " + md.SKsviatky
            );
        }


        this.virtualDOM.currentDayResult = short;
    }


    getResultByDatum(datum) {
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

        let meninyDen = MENINY_DATASET[ datum.mesiac + "-" + datum.den ];


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
            if (meninyDen[skratka] != undefined) {
                let b = bold.cloneNode();
                b.append(skratky[skratka] + ": ");

                setup.push(
                    b,
                    meninyDen[skratka],
                    br.cloneNode()
                );
            }
        }


        builtResult.append(...setup);

        return builtResult;
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

        this.shadowRoot.append(
            this.virtualDOM.currentDayResult
        );
    }
}

class MeninyDnesnePlne extends Meniny {
    constructor() {
        super();
        this.setupElementBody();
    }

    setupElementBody() {
        this.setupCurrentDay();

        this.shadowRoot.append(
            this.virtualDOM.currentDayResult
        );
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
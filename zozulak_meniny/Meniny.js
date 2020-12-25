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


        this.setupElementBody();
    }


    setMultipleAttrs(element, attrs) {
        for (let a in attrs) element.setAttribute(a, attrs[a]);
    }



    setupDatumInput() {
        this.virtualDOM.datumInput = document.createElement("input");
        
        this.setMultipleAttrs(this.virtualDOM.datumInput, {
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
            type: "text",
            placeholder: "na diakritike a veľkosti písmen nezáleží",
            id: "datum"
        });

        this.virtualDOM.searchInput.addEventListener("change", this.getSearchString.bind(this));
    }


    setupInnerCSS() {
        return `<style>
            input {
                width: 250px;
            }
        </style>`;
    }

    setupElementBody() {
        this.setupDatumInput();
        this.setupSearchInput();
        this.setupCurrentDay();
        
        this.virtualDOM.resultListContainerDiv = document.createElement("div");


        let br = document.createElement("br");

        this.shadowRoot.append(
            "Zadaj dátum: ",
            this.virtualDOM.datumInput,
            br.cloneNode(),
            "Zadaj meno alebo jeho časť: ",
            this.virtualDOM.searchInput,
            br.cloneNode(), br.cloneNode(),
            "--- DNEŠNÝ DEŇ ---", br.cloneNode(),
            this.virtualDOM.currentDayResult, br.cloneNode(), br.cloneNode(),
            "--- VÝSLEDKY VYHĽADÁVANIA ---", br.cloneNode(),
            this.virtualDOM.resultListContainerDiv
        );
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


customElements.define("meniny-component", Meniny);
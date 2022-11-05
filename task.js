function onClick(button) {
    let buttonId = button.id, bannerOffers;
    switch (buttonId) {
        case '1':
            bannerOffers = document.getElementById('bannerGridOffers');
            this.setBanner('grid', 4, bannerOffers);
            this.setClass("bannerGrid", "hidden-task", "task-wrapper");
            this.setActiveElement(4, 2, "grid");
            break;
        case '2':
            bannerOffers = document.getElementById('bannerSliderOffers');
            this.setBanner("slider", 3, bannerOffers);
            this.setClass("bannerSlider", "hidden-task", "task-wrapper");
            this.setActiveElement(3, 2, "slider");
            break;
        case '3':
            const now = new Date();
            let countDownDate = now.setDate(now.getDate() + 7);
            // let countDownDate = now.setMinutes ( now.getMinutes() + 1 );
            this.setClass("counter", "hidden-task", "task-wrapper");
            this.startCountDown(countDownDate);
            break;
    }
}

function startCountDown(countDownDate) {
    const banner = document.getElementById("counter"),
    repeater = () => {
        setTimeout(() => {
            let now = new Date().getTime(),
                distance = countDownDate - now,
                days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000);
            banner.innerHTML = (days ? days + "d " : "") + (hours ? hours + "h " : "")
                + (minutes ? minutes + "m " : "") + (seconds ? seconds + "s " : "");

            if (distance < 0) {
                banner.innerHTML = "Promocja zakończona";
                return;
            }
            if (banner.classList.contains("hidden-task")) {
                return;
            }
            repeater();
        }, 1000);
    };
    repeater();
}

function setActiveElement(numberOfIterations, timeBetweenItereation, bannerType) {
    let iterationCounter = 0, classToSet, elementsClass, elementId;
    switch (bannerType) {
        case "grid":
            elementId = "bannerGrid";
            classToSet = "not-highlight-element";
            elementsClass = "banner-offer";
            break;
        case "slider":
            elementId = "bannerSlider";
            classToSet = "hidden-slider-element";
            elementsClass = "banner-slide";
            break;
    }
    const banner = document.getElementById(elementId),
        repeater = () => {
            setTimeout(() => {
                this.setClass(elementId + iterationCounter, classToSet, elementsClass);
                iterationCounter++;

                if (iterationCounter >= numberOfIterations) {
                    iterationCounter = 0;
                }
                if (banner.classList.contains("hidden-task")) {
                    return;
                }
                repeater();
            }, 1000 * timeBetweenItereation);
        };
    repeater();
}

function setClass(elementId, classToSet, allElementsClass = null) {
    let actualElement = document.getElementById(elementId);

    //remove class for others
    if (allElementsClass) {
        let elementNodeList = document.getElementsByClassName(allElementsClass),
            elements = Array.prototype.map.call(elementNodeList, function (element) {
                return element;
            });
        elements.forEach(function (item) {
            if (!item.classList.contains(classToSet)) {
                item.classList.add(classToSet);
            }
        });
    }
    //add class to actual element
    actualElement.classList.remove(classToSet);
}

function setBanner(bannerType, offersAmount, bannerOffers) {
    const currencies = {"PLN": "zł"};
    let offersContent = '', offersCounter = 0;
    this.getBannerData().then(data => {
        if (data.offers) {
            // if there are offers
            let randomItems = data.offers.sort(() => .5 - Math.random()).slice(0, offersAmount);
            randomItems.forEach(function (item) {
                let currency = (item.currency in currencies) ? currencies[item.currency] : item.currency,
                    price = Number(item.price).toLocaleString("fr-FR", {minimumFractionDigits: 2});
                //setting offers in banner
                if (bannerType === 'grid') {
                    offersContent += "<div id=\"bannerGrid" + offersCounter + "\" class=\"banner-offer not-highlight-element\">" +
                        "<img src=\"http:" + item.imgURL + "\" class=\"banner-offer-photo\">" +
                        "<div class=\"banner-offer-desc\">" + price + ' ' + currency + "</div>" +
                        "</div>";

                } else if (bannerType === 'slider') {
                    offersContent += "<div id=\"bannerSlider" + offersCounter + "\" class=\"banner-slide slide-fade hidden-slider-element\">" +
                        "  <img src=\"http:" + item.imgURL + "\" class=\"slider-offer-photo\">" +
                        "  <div class=\"slider-offer-desc\">" + item.name + "</div>" +
                        "  <div class=\"slider-offer-price\">" + price + ' ' + currency + "</div>" +
                        "  <button type=\"button\" class=\"slider-offer-button\">Check</button>" +
                        "</div>"
                }
                offersCounter++;
            });
            bannerOffers.innerHTML = offersContent;
        }
    });
}

function getBannerData() {
    let bannerData = null;
    return fetch('https://cors-anywhere.herokuapp.com/rekrutacjartb.pl/developer/banner.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok :(');
            }
            return response.json();
        })
        .catch(err => function () {
            alert('Error: ' + err);
        })
}

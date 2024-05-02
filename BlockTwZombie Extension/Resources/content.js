const namespaceResolver = function (prefix) {
    switch (prefix) {
        case "svg":
            return "http://www.w3.org/2000/svg";
        default:
            return null;
    }
};

const __getElementByXPath = function(path, root) {
    const result = document.evaluate(path, root, namespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return result.snapshotLength > 0 ? result.snapshotItem(0) : null;
}

const __getElementsByXPath = function(path, root) {
    const array = [];
    const result = document.evaluate(path, root, namespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < result.snapshotLength; i++) {
        array.push(result.snapshotItem(i));
    }
    return array;
}

document.getElementByXPath = function(path) {
    return __getElementByXPath(path, this);
}
document.getElementsByXPath = function(path) {
    return __getElementsByXPath(path, this);
}
HTMLElement.prototype.getElementByXPath = function(path) {
    return __getElementByXPath(path, this);
}
HTMLElement.prototype.getElementsByXPath = function(path) {
    return __getElementsByXPath(path, this);
}

function getSVGHeightPX(action_group) {
    const svgs = action_group.getElementsByXPath(".//svg:svg");
    
    var max_height = 0;
    for (let svg of svgs) {
        const baseVal = svg.height.baseVal;
        baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        const height = baseVal.valueInSpecifiedUnits;
        if (height > max_height) max_height = height;
    }
    return max_height;
};

function createBlockSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "viewBox", "0 0 96 96");
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttributeNS(null, "style", "stroke: rgb(204, 0, 0);");
    group.setAttributeNS(null, "transform", "translate(58 50)");
    svg.appendChild(group);
    var path;
    
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "style", "stroke-width: 10;");
    path.setAttributeNS(null, "d", "M -16 -16 L 16 16");
    group.appendChild(path);
    
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "style", "stroke-width: 10;");
    path.setAttributeNS(null, "d", "M -16 16 L 16 -16");
    group.appendChild(path);
    
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "style", "stroke-width: 6; fill-opacity: 0; stroke-linejoin: round;");
    path.setAttributeNS(null, "d", "M -47 0 L -12 35 L 27 35 L 27 -35 L -12 -35 z");
    group.appendChild(path);
    
    return svg;
};

function onClickIcon(event) {
    var elem;
    event.preventDefault();
    
    elem = event.currentTarget;
    while (elem != null && elem.tagName != "ARTICLE") elem = elem.parentElement;
    elem = elem.querySelector("[role='button'][aria-haspopup='menu']");
    elem.click();

    var block = null, confirm = null;
    function callback() {
        if (block == null) {
            block = document.querySelector("[role='menuitem'][data-testid='block']");
            if (block != null) {
                block.click();
            }
            return;
        }
        if (confirm == null) {
            confirm = document.querySelector("[role='button'][data-testid='confirmationSheetConfirm']");
            if (confirm != null) {
                confirm.click();
                clearInterval(timer);
            }
            return;
        }
    };
    var timer = setInterval(callback, 100);
};

function main(e) {
    const this_class = "block_tw_zombie";
    
    function onTimer() {
        // find articles
        const articles = document.querySelectorAll("[role='article']");
        if (articles.length == 0) return;
        clearInterval(timer);

        for (let article of articles) {
//            // find bottom buttons
//            const elems = article.querySelectorAll("[role='group']");
//            const action_group = elems[elems.length - 1];

            // find a menu button
            const menu = article.querySelector("[role='button'][aria-haspopup='menu']");
            if (menu == null) continue;
            // check if already modified
            if (menu.nextElementSibling != null && menu.nextElementSibling.classList.contains(this_class)) continue;

            // create a div element
            const mydiv = document.createElement("div");
            console.log("div", mydiv);
            mydiv.className = this_class;
            mydiv.style.width = menu.offsetWidth;
            mydiv.style.marginLeft = "15%";

            // add elements under the div element
            const block_button = document.createElement("div");
            block_button.style.width = getSVGHeightPX(menu) + "px";
            block_button.style.height = "100%";
            block_button.addEventListener("click", onClickIcon);
            mydiv.appendChild(block_button);
            var svg = createBlockSVG();
            svg.style.width = "100%";
            svg.style.height = "100%";
            block_button.appendChild(svg);
            
            // append the div element after the menu button.
            menu.parentElement.appendChild(mydiv);
        }
    };
    const timer = setInterval(onTimer, 100);
};

window.addEventListener("load", main);
window.addEventListener("scroll", main);


/*
console.log(0);
new Promise(resolve => {
    var x = 0;
    const h = setInterval(callback, 100);
    function callback() {
        x = x + 1;
        console.log("interval", x);
        if (x >= 10) {
            clearInterval(h);
            resolve(x);
        }
    };
}).then(v) => {
    console.log(-100);
    console(v);
};
console.log(-100000);

/*
 var result = await new Promise(resolve => {
     var x = 0;
     const h = setInterval(callback, 100);
     function callback() {
         x = x + 1;
         console.log("interval", x);
         if (x >= 10) {
             clearInterval(h);
             resolve(x);
         }
     };
 });

 
 var x = 0;
const h = setInterval(callback, 100);
function callback() {
    x = x + 1;
    console.log("interval", x);
    if (x >+ 10) clearInterval(h);
};
console.log(-100000);

/*
var x = 0;
const h = setInterval(() => {
    x = x + 1;
    console.log("interval", x);
    if (x >+ 10) clearInterval(h);
}, 100);

/*
var articles_ = await new Promise(resolve => {
    console.log(11);
    const h = setInterval(callback, 100);
    function callback() {
        console.log(12);
        const article = document.querySelectorAll("[role='article']");
        if (block != null) {
            clearInterval(h);
            resolve(article);
        }
    };
});
for (let a of articles_) {
    console.log("article", a);
}
 */

/*
var articles_ = await new Promise(resolve => {
    console.log(11);
    const h = setInterval(() => {
        console.log(12);
        const article = document.querySelectorAll("[role='article']");
        if (block != null) {
            clearInterval(h);
            resolve(article);
        }
    }, 100);
});
for (let a of articles_) {
    console.log("article", a);
}
 */

/*
browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Responder1 at content");
    console.log("Received response at content: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Responder2 at content");
    console.log("Received request at content: ", request);
});
*/

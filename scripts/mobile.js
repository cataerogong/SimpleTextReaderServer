// 添加移动端适配
(function () {
    'use strict';

    if (!("ontouchstart" in document.documentElement)) {
        return;
    }

    // SVG
    $("head").append(`<svg>
<symbol id="openfile" viewBox="0 0 24 24">
    <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
</symbol>
    </svg>`);
    // CSS
    $("head").append(`<style>
:root {
    touch-action: none;
    font-size: ${Math.floor(window.devicePixelRatio*12)}px;
}
.op-bar {
    position: fixed;
    width: 100vw;
    padding: 2vw 2vh;
    overflow: hidden;
    z-index: 2000;
    border: 1px red solid;
}
.bar-icon {
    display: inline-flex;
}
    </style>`);

    $("#dropZoneImg").attr("src", "./images/seal_EN.png");

    function removeAllEventListeners(elm) {
        var clone = elm.cloneNode (true);
        elm.parentNode.replaceChild(clone, elm);
        return clone;
    }

    // 移动端界面不包括：pagination
    if (isVariableDefined(paginationContainer)) {
        $(paginationContainer).remove();
        paginationContainer = null;
    }

    // dropZone event listeners
    if (isVariableDefined(dropZone)) {
        dropZone = removeAllEventListeners(dropZone);
        dropZone.addEventListener('touchend', switchOpBars, false);
    }

    function generateOpBars() {
        let bottomBar = $(`<div id="bottom_bar" class="op-bar" style="bottom:0px;"></div>`);
        $(darkModeActualButton).removeClass("switch-btn").addClass("bar-icon");
        $("#switch-btn svg").addClass("icon");
        bottomBar.append([$(darkModeActualButton), $(darkModeToggle)]);
        bottomBar.prependTo($('body'));
        let openFileBtn = $(`<div class="bar-icon"><svg class="icon"><use xlink:href="#openfile"></use></svg></div>`);
        openFileBtn.click(openFileSelector);
        bottomBar.prepend(openFileBtn);
    }
    generateOpBars();
    function switchOpBars() {
        $("#bottom_bar").toggle();
    }
})();
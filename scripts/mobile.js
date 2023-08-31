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
body {
    margin-bottom: 0px;
}
.op-ui {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 9999;
}
.op-mask {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}
.op-bar {
    display: inline-flex;
    position: fixed;
    width: 100%;
    background: var(--bgColor);
    padding: 2vh 0vw;
    justify-content: space-between;
    overflow: hidden;
}
div.bar-icon {
    display: inline-flex;
    width: 3rem;
    height: 2rem;
    padding-left: 0.5rem;
    overflow: hidden;
    border: 0px green solid;
}
svg.sun {
    width: 2rem;
    height: 2rem;
}
svg.moon {
    width: 2rem;
    height: 2rem;
}
#switch ~ div.bar-icon div {
    transform: translateY(25%);
    transition: var(--darkMode_animation);
}

#switch:checked ~ div.bar-icon div {
    transform: translateY(-25%);
    transition: var(--darkMode_animation);
}
/*
#switch:checked ~ div.bar-icon svg.sun {
    display:none;
}
#switch:checked ~ div.bar-icon svg.moon {
    display:unset;
}
*/
label.bar-icon {
    width: 2rem;
    height: 2rem;
}
#pagination {
    font-size: 1rem;
}
    </style>`);

    $("#dropZoneImg").attr("src", "./images/seal_EN.png");
    style.ui_contentWidth = "100";
    style.ui_windowLeftRightMargin = "0";
    style.ui_gapWidth = "0";
    style.ui_numPaginationItems = "5";
    setMainContentUI();
    $("#content").css("height", document.documentElement.clientHeight + "px");
    $("#content").css("overflow-y", "hidden");
    $(footNoteContainer).hide();

    function removeAllEventListeners(elm) {
        var clone = elm.cloneNode (true);
        elm.parentNode.replaceChild(clone, elm);
        return clone;
    }

    // 移动端界面不包括：pagination
    if (isVariableDefined(paginationContainer)) {
        // $(paginationContainer).hide();
    }
    if (isVariableDefined(tocWrapper)) {
        $(tocWrapper).hide();
    }
    if (isVariableDefined(progress)) {
        $(progress).hide();
    }

    // event listeners

    function showOpUI() {
        $("#op-ui").show();
    }
    function hideOpUI() {
        $("#op-ui").hide();
    }

    if (isVariableDefined(dropZone)) {
        dropZone = removeAllEventListeners(dropZone);
        dropZone.addEventListener('touchend', showOpUI, false);
    }

    function goPrev() {
        if (contentContainer.scrollTop <= 0) {
            if (currentPage > 1) {
                jumpToPage(currentPage - 1);
                contentContainer.scrollTo({top: contentContainer.scrollHeight, behavior: "instant"});
            }
        } else {
            contentContainer.scrollBy({top: -contentContainer.clientHeight+2*12*window.devicePixelRatio, behavior: "instant"});
        }
    }
    function goNext() {
        if (contentContainer.scrollTop + contentContainer.clientHeight >= contentContainer.scrollHeight) {
            jumpToPage(currentPage + 1);
            contentContainer.scrollTo({top: 0, behavior: "instant"});
        } else {
            contentContainer.scrollBy({top: contentContainer.clientHeight-2*12*window.devicePixelRatio, behavior: "instant"});
        }
    }
    let touch = null;
    let touch_t = 0;
    function onContentTouchStart(evt) {
        if (evt.touches.length == 1) {
            touch = evt.touches[0];
            touch_t = new Date().getTime();
        }
    }
    function onContentTouchEnd(evt) {
        if (touch && (evt.changedTouches.length == 1)) {
            let t = evt.changedTouches[0];
            let x = t.clientX - touch.clientX;
            let y = t.clientY - touch.clientY;
            let d = 50;
            let move = (Math.abs(x) <= d && Math.abs(y) <= d)
                ? "CLICK"
                : (Math.abs(x) > Math.abs(y))
                    ? ((x > 0) ? "RIGHT" : "LEFT")
                    : ((y > 0) ? "DOWN" : "UP")
            switch (move) {
                case "CLICK":
                    if (new Date().getTime() - touch_t <= 200) { // 200ms 内才算点击
                        if (t.clientX < (contentContainer.clientWidth/3)) {
                            goPrev();
                        } else if (t.clientX > (contentContainer.clientWidth*2/3)) {
                            goNext();
                        } else {
                            showOpUI();
                        }
                    }
                    break;
                case "LEFT":
                    // jumpToPage(currentPage + 1);
                    // break;
                case "UP":
                    goNext();
                    break;
                case "RIGHT":
                    // jumpToPage(currentPage - 1);
                    // break;
                case "DOWN":
                    goPrev();
                    break;
            }
            console.log("C" + currentPage
                + ":P" + Math.ceil(contentContainer.scrollTop/contentContainer.clientHeight+1) + "/" + Math.ceil(contentContainer.scrollHeight/contentContainer.clientHeight)
                + " "
                + "X:" + contentContainer.scrollTop + "/" + contentContainer.scrollHeight);
            touch = null;
            touch_t = 0;
        }
    }
    if (isVariableDefined(contentContainer)) {
        contentContainer.addEventListener('touchstart', onContentTouchStart, false);
        contentContainer.addEventListener('touchend', onContentTouchEnd, false);
    }

    function switchDarkMode(e) {
        setUIMode(!e.target.checked);
    }

    if (isVariableDefined(darkModeToggle)) {
        darkModeToggle = removeAllEventListeners(darkModeToggle);
        darkModeToggle.addEventListener("change", switchDarkMode);
    }

    function generateOpUI() {
        let opLayer = $(`<div id="op-ui" class="op-ui"><div id="op-mask" class="op-mask"></div></div>`).hide();
        let bottomBar = $(`<div id="bottom_bar" class="op-bar" style="bottom:0px;"></div>`);

        let openFileBtn = $(`<div class="bar-icon"><svg class="icon"><use xlink:href="#openfile"></use></svg></div>`);
        openFileBtn.on("touchend", (e) => {resetVars(); openFileSelector(e);});
        bottomBar.append(openFileBtn);

        $(darkModeActualButton).removeClass("switch-btn").addClass("bar-icon");
        $("#switch-btn label").addClass("bar-icon");
        $("#switch-btn label div").removeClass("icons");
        bottomBar.append([$(darkModeToggle), $(darkModeActualButton)]);

        bottomBar.append($("div.icon-btn").removeClass("icon-btn").addClass("bar-icon"));
        bottomBar.append("<br /><br /><br /><br />");
        $(paginationContainer).appendTo(bottomBar);

        opLayer.append(bottomBar);
        opLayer.prependTo($('body'));

        $("#op-mask").on("touchend", hideOpUI);
    }

    generateOpUI();
})();
// ------------------------------------------------
// Settings
// ------------------------------------------------

let pagination_bottom_default = getCSS("#pagination", "bottom");
let p_lineHeight_default = getCSS(":root", "--p_lineHeight");
let p_fontSize_default = getCSS(":root", "--p_fontSize");
let light_fontColor_default = getCSS(":root", "--fontColor");
let light_bgColor_default = getCSS(":root", "--bgColor");
let dark_fontColor_default = getCSS('[data-theme="dark"]', "--fontColor");
let dark_bgColor_default = getCSS('[data-theme="dark"]', "--bgColor");

let pagination_bottom;
let p_lineHeight;
let p_fontSize;
let light_fontColor;
let light_bgColor;
let dark_fontColor;
let dark_bgColor;

// load settings
function loadSettings() {
	pagination_bottom = localStorage.getItem("pagination_bottom") || pagination_bottom_default;
	p_lineHeight = localStorage.getItem("p_lineHeight") || p_lineHeight_default;
	p_fontSize = localStorage.getItem("p_fontSize") || p_fontSize_default;
	light_fontColor = localStorage.getItem("light_fontColor") || light_fontColor_default;
	light_bgColor = localStorage.getItem("light_bgColor") || light_bgColor_default;
	dark_fontColor = localStorage.getItem("dark_fontColor") || dark_fontColor_default;
	dark_bgColor = localStorage.getItem("dark_bgColor") || dark_bgColor_default;
}

function getCSS(sel, prop) {
	for (const sheet of document.styleSheets) {
		for (const rule of sheet.cssRules) {
			if (rule.selectorText === sel) {
				return rule.style.getPropertyValue(prop);
			}
		}
	}
	return null;
}

function setCSS(sel, prop, val, def) {
	for (const sheet of document.styleSheets) {
		for (const rule of sheet.cssRules) {
			if (rule.selectorText === sel) {
				rule.style.setProperty(prop, val?val:def);
				console.log(sel + " { " + prop + " : " + (val?val:def) + " }");
			}
		}
	}
}

function applySettings() {
	setCSS("#pagination", "bottom", pagination_bottom, pagination_bottom_default);
	setCSS(":root", "--p_lineHeight", p_lineHeight, p_lineHeight_default);
	setCSS(":root", "--p_fontSize", p_fontSize, p_fontSize_default);
	setCSS(":root", "--fontColor", light_fontColor, light_fontColor_default);
	setCSS(":root", "--bgColor", light_bgColor, light_bgColor_default);
	setCSS('[data-theme="dark"]', "--fontColor", dark_fontColor, dark_fontColor_default);
	setCSS('[data-theme="dark"]', "--bgColor", dark_bgColor, dark_bgColor_default);
}

function showSettings() {
	$(`
<div id="settings" style="position:fixed;right:20px;bottom:70px;z-index:1006;background: var(--mainColor);border:1px darkgray solid;border-radius:10px;padding:10px;">
	<div>
		<span style="display:inline-block;width:10rem">行高：</span>
		<input type="text" size="10" id="setting_p_lineHeight" value="${p_lineHeight}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">字号：</span>
		<input type="text" size="10"  id="setting_p_fontSize" value="${p_fontSize}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">日间字符色：</span>
		<input type="text" size="10"  id="setting_light_fontColor" value="${light_fontColor}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">日间背景色：</span>
		<input type="text" size="10"  id="setting_light_bgColor" value="${light_bgColor}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">夜间字符色：</span>
		<input type="text" size="10"  id="setting_dark_fontColor" value="${dark_fontColor}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">夜间背景色：</span>
		<input type="text" size="10"  id="setting_dark_bgColor" value="${dark_bgColor}" />
	</div>
	<div>
		<span style="display:inline-block;width:10rem">分页条与底部距离：</span>
		<input type="text" size="10"  id="setting_pagination_bottom" value="${pagination_bottom}" />
	</div>
	<div style="padding:4px;">
		<button onclick="removeAllHistory();loadSettings();applySettings();hideSettings();" style="color:red;">清空设置&阅读历史</button>
		<button onclick="saveSettings();">应用</button>
		<button onclick="hideSettings();">取消</button>
	</div>
</div>
`).insertAfter("#switch-btn");
}

function saveSettings() {
	pagination_bottom = $("#setting_pagination_bottom").val() || pagination_bottom_default;
	p_lineHeight = $("#setting_p_lineHeight").val() || p_lineHeight_default;
	p_fontSize = $("#setting_p_fontSize").val() || p_fontSize_default;
	light_fontColor = $("#setting_light_fontColor").val() || light_fontColor_default;
	light_bgColor = $("#setting_light_bgColor").val() || light_bgColor_default;
	dark_fontColor = $("#setting_dark_fontColor").val() || dark_fontColor_default;
	dark_bgColor = $("#setting_dark_bgColor").val() || dark_bgColor_default;
	localStorage.setItem("pagination_bottom", pagination_bottom);
	localStorage.setItem("p_lineHeight", p_lineHeight);
	localStorage.setItem("p_fontSize", p_fontSize);
	localStorage.setItem("light_fontColor", light_fontColor);
	localStorage.setItem("light_bgColor", light_bgColor);
	localStorage.setItem("dark_fontColor", dark_fontColor);
	localStorage.setItem("dark_bgColor", dark_bgColor);
	applySettings();
	hideSettings();
}
function hideSettings() {
	$("#settings").remove();
}

$(`
<div style="position:fixed;bottom:70px;right:20px;width:30px;height:30px;padding:4px;z-index:1005;color:var(--mainColor_focused);cursor:pointer;" onclick="showSettings();">
	<span class="material-symbols-rounded"> settings </span>
</div>
`).insertBefore("#switch");

loadSettings();
applySettings();


// ------------------------------------------------
// Open Link
// ------------------------------------------------

function openLink(link) {
	let xhr = new XMLHttpRequest();
	xhr.open("get", link, true);
	xhr.responseType = "blob";
	xhr.onload = function() {
		// console.log(this.response);
		this.response.name = decodeURI(link);
		handleSelectedFile([this.response]);
	}
	xhr.send();
	showLoadingScreen();
}

function showOpenLink() {
	let link = prompt("打开 txt 链接");
	if (!link)
		return;
	openLink(link);
}

$(`
<div style="position:fixed;bottom:120px;right:20px;width:30px;height:30px;padding:4px;z-index:1005;color:var(--mainColor_focused);cursor:pointer;">
	<span class="material-symbols-rounded"> add_link </span>
</div>
`).insertBefore("#switch").click(showOpenLink);


// ------------------------------------------------
// Open file on server
// ------------------------------------------------

let strs_server = "";
let strs_tag = "<STRSvr>";

function openFileOnServer(filename) {
	let link = strs_server + "/books/" + filename;
	let xhr = new XMLHttpRequest();
	xhr.open("get", link, true);
	xhr.responseType = "blob";
	xhr.onload = function() {
		// console.log(this.response);
		this.response.name = strs_tag + filename;
		handleSelectedFile([this.response]);
	}
	xhr.send();
	showLoadingScreen();
}

function showOpenFileOnServerDlg() {
	$.getJSON(strs_server + "/books").done(data => {
		let book_list = "";
		data.books.forEach((v) => {
			book_list += `<div style="cursor:pointer" onclick="openFileOnServer('${v}');$('#OpenFileOnServerDlg').remove();">${v}</div>`;
		});
		$(`<dialog id="OpenFileOnServerDlg" style="width:600px;height:500px">
			${book_list}
			</dialog>`).insertAfter("#switch-btn");
		document.getElementById("OpenFileOnServerDlg").showModal();
	});
}

$(`
<div style="position:fixed;bottom:170px;right:20px;width:30px;height:30px;padding:4px;z-index:1005;color:var(--mainColor_focused);cursor:pointer;">
	<span class="material-symbols-rounded"> folder_open </span>
</div>
`).insertBefore("#switch").click(showOpenFileOnServerDlg);

// hack functions
let strs_file_line = "";
function setProgressToServer() {
	if (!filename)
		return;
	let line = getTopLineNumber();
	if ((filename + ":" + line) == strs_file_line)
		return;
	console.log("setProgressToServer(): " + filename.substring(strs_tag.length) + ":" + line);
	$.ajax({
		method: "PUT",
		url: strs_server + "/progress/" + filename.substring(strs_tag.length),
        contentType: "application/json",
        data: JSON.stringify(line)
	}).done(resp => {
		console.log(resp);
		strs_file_line = filename + ":" + line;
	}).fail(err => {
		console.log(err);
	})
}
setInterval(setProgressToServer, 1000);
// let hack_setHistory = setHistory.toString() + `
// //console.log("hack_setHistory(): " + filename + ":" + lineNumber);
// if ((filename.substring(0, strs_tag.length) != strs_tag)) {
// 	setHistory(filename, lineNumber);
// }
// `;
// window["setHistory"] = new Function("filename, lineNumber", hack_setHistory);

function get_func_body(func) {
	let re = /^\s*function\s*\w*\s*\([^\)]*\)[^{]*{(.*)}\s*$/si;
	let r = re.exec(func.toString());
	if (r)
		return r[1];
	else
		return "";
}

window["setHistory_"] = new Function("filename, lineNumber", get_func_body(setHistory));
window["setHistory"] = new Function("filename, lineNumber",
`// console.log("HACK setHistory(): " + filename + ":" + lineNumber);
if ((filename.substring(0, strs_tag.length) != strs_tag)) {
	setHistory_(filename, lineNumber);
}`);

async function getProgressFromServer(filename) {
	console.log("getProgressFromServer(): " + filename);
	let line = 0
	$.ajax({
		async: false,
		method: "GET",
		url: strs_server + "/progress/" + filename,
        contentType: "application/json"
	}).done(resp => {
		line = parseInt(resp.line);
	});
	if (line) {
		console.log("Goto line: " + line);
		let success = gotoLine(line, false);
        if (success === -1) {
            line = 0;
        }
	}
	return line;
}
window["getHistory_"] = new Function("filename", get_func_body(getHistory));
window["getHistory"] = new Function("filename,",
`//console.log("HACK getHistory(): " + filename);
if ((filename.substring(0, strs_tag.length) == strs_tag)) {
	return getProgressFromServer(filename.substring(strs_tag.length));
} else {
	return getHistory_(filename);
}`);

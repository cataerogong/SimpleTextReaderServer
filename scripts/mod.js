document.styleSheets[0].insertRule(`.icon-btn {
	cursor: pointer;
	position: fixed;
	right: 20px;
	width: 30px;
	height: 30px;
	padding: 4px;
	z-index: 1005;
	color: var(--mainColor_focused);
}`);
document.styleSheets[0].insertRule(`dialog {
	border-radius: 10px;
	font-family: ui;
	font-size: var(--p_fontSize);
	background: var(--bgColor);
	color: var(--fontColor);
}`);
document.styleSheets[0].insertRule(`dialog::backdrop {background-color: rgba(0,0,0,0.5)}`);
document.styleSheets[0].insertRule(`dialog .dlg-close-btn {
	cursor: pointer;
	float: right;
	padding: 2px;
	border: 1px solid;
	border-radius: 5px;
}`);
document.styleSheets[0].insertRule(`dialog span.dlg-body {
	display: block;
	overflow: auto;
	margin: 10px 20px;
	padding: 5px;
}`);
document.styleSheets[0].insertRule(`dialog span.dlg-body input {
	float: right;
	font-family: ui;
	font-size: 1em;
	background: var(--bgColor);
	color: var(--fontColor);
}`);
document.styleSheets[0].insertRule(`dialog span.dlg-body button {
	font-family: ui;
	padding: 2px 10px;
	border: 1px solid;
	border-radius: 5px;
	font-size: 1em;
	background: var(--bgColor);
	color: var(--fontColor);
}`);
document.styleSheets[0].insertRule(`#pagination:hover {opacity: 1;}`);

const func_keydown_ = document.onkeydown; // 保存页面原来的 onkeydown 函数，下面会临时屏蔽 onkeydown

// ------------------------------------------------
// Settings
// ------------------------------------------------

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
function setCSS(sel, prop, val, defVal) {
	for (const sheet of document.styleSheets) {
		for (const rule of sheet.cssRules) {
			if (rule.selectorText === sel) {
				rule.style.setProperty(prop, val?val:defVal);
				// console.log(sel + " { " + prop + " : " + (val?val:defVal) + " }");
			}
		}
	}
}

let p_lineHeight_default = getCSS(":root", "--p_lineHeight");
let p_fontSize_default = getCSS(":root", "--p_fontSize");
let light_fontColor_default = getCSS(":root", "--fontColor");
let light_bgColor_default = getCSS(":root", "--bgColor");
let dark_fontColor_default = getCSS('[data-theme="dark"]', "--fontColor");
let dark_bgColor_default = getCSS('[data-theme="dark"]', "--bgColor");
let pagination_bottom_default = getCSS("#pagination", "bottom");
let pagination_opacity_default = "1";

let p_lineHeight;
let p_fontSize;
let light_fontColor;
let light_bgColor;
let dark_fontColor;
let dark_bgColor;
let pagination_bottom;
let pagination_opacity;

// load settings
function loadSettings() {
	p_lineHeight = localStorage.getItem("p_lineHeight") || p_lineHeight_default;
	p_fontSize = localStorage.getItem("p_fontSize") || p_fontSize_default;
	light_fontColor = localStorage.getItem("light_fontColor") || light_fontColor_default;
	light_bgColor = localStorage.getItem("light_bgColor") || light_bgColor_default;
	dark_fontColor = localStorage.getItem("dark_fontColor") || dark_fontColor_default;
	dark_bgColor = localStorage.getItem("dark_bgColor") || dark_bgColor_default;
	pagination_bottom = localStorage.getItem("pagination_bottom") || pagination_bottom_default;
	pagination_opacity = localStorage.getItem("pagination_opacity") || pagination_opacity_default;
}

function applySettings() {
	setCSS(":root", "--p_lineHeight", p_lineHeight, p_lineHeight_default);
	setCSS(":root", "--p_fontSize", p_fontSize, p_fontSize_default);
	setCSS(":root", "--fontColor", light_fontColor, light_fontColor_default);
	setCSS(":root", "--bgColor", light_bgColor, light_bgColor_default);
	setCSS('[data-theme="dark"]', "--fontColor", dark_fontColor, dark_fontColor_default);
	setCSS('[data-theme="dark"]', "--bgColor", dark_bgColor, dark_bgColor_default);
	setCSS("#pagination", "bottom", pagination_bottom, pagination_bottom_default);
	setCSS("#pagination", "opacity", pagination_opacity, pagination_opacity_default);
}

function showSettingDlg() {
	$(`
<dialog id="settingDlg">
	<div><span class="material-symbols-rounded dlg-close-btn" onclick="hideSettingDlg();"> close </span></div>
	<span class="dlg-body">
	<div>
		<span>行高：</span>
		<input type="text" size="10" style="float:right" id="setting_p_lineHeight" value="${p_lineHeight}" />
	</div>
	<div>
		<span>字号：</span>
		<input type="text" size="10" id="setting_p_fontSize" value="${p_fontSize}" />
	</div>
	<div>
		<span>日间字符色：</span>
		<input type="text" size="10" id="setting_light_fontColor" value="${light_fontColor}" />
	</div>
	<div>
		<span>日间背景色：</span>
		<input type="text" size="10" id="setting_light_bgColor" value="${light_bgColor}" />
	</div>
	<div>
		<span>夜间字符色：</span>
		<input type="text" size="10" id="setting_dark_fontColor" value="${dark_fontColor}" />
	</div>
	<div>
		<span>夜间背景色：</span>
		<input type="text" size="10" id="setting_dark_bgColor" value="${dark_bgColor}" />
	</div>
	<div>
		<span>分页条与底部距离：</span>
		<input type="text" size="10" id="setting_pagination_bottom" value="${pagination_bottom}" />
	</div>
	<div>
		<span>分页条透明度：</span>
		<input type="text" size="10" id="setting_pagination_opacity" value="${pagination_opacity}" />
	</div>
	<div style="padding:4px;margin-top:10px;">
		<button onclick="removeAllHistory();loadSettings();applySettings();hideSettingDlg();" style="color:var(--mainColor_focused);">！清空设置&阅读历史！</button>
		<button onclick="saveSettings();applySettings();hideSettingDlg();" style="float:right;">应用</button>
	</div>
	</span>
</dialog>
`).bind("cancel", hideSettingDlg).insertAfter("#switch-btn");
	document.getElementById("settingDlg").showModal();
	// document.getElementById("settingDlg").
	document.onkeydown = null;
}

function saveSettings() {
	p_lineHeight = $("#setting_p_lineHeight").val() || p_lineHeight_default;
	p_fontSize = $("#setting_p_fontSize").val() || p_fontSize_default;
	light_fontColor = $("#setting_light_fontColor").val() || light_fontColor_default;
	light_bgColor = $("#setting_light_bgColor").val() || light_bgColor_default;
	dark_fontColor = $("#setting_dark_fontColor").val() || dark_fontColor_default;
	dark_bgColor = $("#setting_dark_bgColor").val() || dark_bgColor_default;
	pagination_bottom = $("#setting_pagination_bottom").val() || pagination_bottom_default;
	pagination_opacity = $("#setting_pagination_opacity").val() || pagination_opacity_default;
	localStorage.setItem("p_lineHeight", p_lineHeight);
	localStorage.setItem("p_fontSize", p_fontSize);
	localStorage.setItem("light_fontColor", light_fontColor);
	localStorage.setItem("light_bgColor", light_bgColor);
	localStorage.setItem("dark_fontColor", dark_fontColor);
	localStorage.setItem("dark_bgColor", dark_bgColor);
	localStorage.setItem("pagination_bottom", pagination_bottom);
	localStorage.setItem("pagination_opacity", pagination_opacity);
}
function hideSettingDlg() {
	$("#settingDlg").remove();
	document.onkeydown = func_keydown_;
}

$(`
<div class="icon-btn" style="bottom:70px;">
	<span class="material-symbols-rounded"> settings </span>
</div>
`).click(showSettingDlg).insertBefore("#switch");

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
		resetVars();
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
<div class="icon-btn" style="bottom:120px;">
	<span class="material-symbols-rounded"> link </span>
</div>
`).insertBefore("#switch").click(showOpenLink);


// ------------------------------------------------
// Open file on server
// ------------------------------------------------

const strs_server = ""; // "http://localhost:8001";
const strs_tag = "☁|";
const strs_file_item = "STRS_FILE";

let strs_file = localStorage.getItem(strs_file_item);
let strs_file_line = ""; // strs_tag + filename + ":" + line

function openFileOnServer(fname) { // fname: 不带 strs_tag 的文件名
	let link = strs_server + "/books/" + fname;
	let xhr = new XMLHttpRequest();
	xhr.open("get", link, true);
	xhr.setRequestHeader("If-Modified-Since","0"); // 强制刷新，不使用缓存
	xhr.responseType = "blob";
	xhr.onload = function() {
		// console.log(this.response);
		resetVars();
		loadProgressFromServer(fname);
		this.response.name = strs_tag + fname;
		handleSelectedFile([this.response]);
	}
	xhr.send();
	showLoadingScreen();
}

function showOpenFileOnServerDlg() {
	let fs = WebDAV.Fs(strs_server);
	let dir = fs.dir("/books");
	let lst = dir.children();
	let fname_list = [];
	for (const f of lst) {
		let fname = decodeURIComponent(f.name);
		if (fname.substring(fname.length - 4).toLowerCase() == ".txt")
			fname_list.push([fname, ""]);
	}
	for (const f of lst) {
		let fname = decodeURIComponent(f.name);
		if (fname.substring(fname.length - 9).toLowerCase() == ".progress") {
			fname = fname.substring(0, fname.length - 9);
			let book = fname_list.find((e) => e[0].toLowerCase() == fname.toLowerCase());
			if (book)
				book[1] = '<span class="material-symbols-rounded" style="vertical-align:bottom;"> clock_loader_40 </span>' + f.read();
		}
	}
	fname_list.sort((a, b) =>
		((a[1] && b[1]) || (!a[1] && !b[1]))
			? (a[0].localeCompare(b[0], "zh"))
			: (a[1] ? -1 : 1));
	// console.log(fname_list);
	let book_list = "";
	for (const f of fname_list) {
		book_list += `<div style="cursor:pointer;border:1px gray dotted;padding:2px 3px;margin:5px 0px;" onclick="openFileOnServer('${f[0]}');hideOpenFileOnServerDlg();">
		<span>${f[0]}</span>&nbsp;<span style="opacity:0.3;float:right;">${f[1]}</span>
		</div>`;
	}
	$(`<dialog id="OpenFileOnServerDlg">
		<div><span class="material-symbols-rounded dlg-close-btn" onclick="hideOpenFileOnServerDlg();"> close </span></div>
		<span class="dlg-body" style="height: 400px;">
		${book_list}
		</span>
		</dialog>`).insertAfter("#switch-btn");
	document.getElementById("OpenFileOnServerDlg").showModal();
	document.getElementById("OpenFileOnServerDlg").addEventListener("cancel", () => hideOpenFileOnServerDlg());
	document.onkeydown = null;
}

function hideOpenFileOnServerDlg() {
	$('#OpenFileOnServerDlg').remove();
	document.onkeydown = func_keydown_;
}

$(`
<div class="icon-btn" style="bottom:170px;">
	<span class="material-symbols-rounded"> cloud </span>
</div>
`).insertBefore("#switch").click(showOpenFileOnServerDlg);

function saveProgressToServer() {
	if ((filename) && (filename.substring(0, strs_tag.length) == strs_tag)) { // file on server
		if (contentContainer.style.display == "none") { // 阅读区域不可见，说明可能正在drag，getTopLineNumber()会取到错误行数，应该跳过
			// console.log("skip");
			return;
		}
		let line = getTopLineNumber(filename);
		if ((filename+":"+line) != strs_file_line) {
			console.log("saveProgressToServer: " + filename + ":" + line);
			localStorage.setItem(strs_file_item, filename.substring(strs_tag.length));
			let prog_file = WebDAV.Fs(strs_server).file("/books/" + filename.substring(strs_tag.length) + ".progress");
			prog_file.write(line);
			strs_file_line = filename + ":" + line;
		}
	} else { // local file
		localStorage.removeItem(strs_file_item);
		strs_file_line = "";
	}
}

function loadProgressFromServer(fname) { // fname: 不带 strs_tag 的文件名
	console.log("loadProgressFromServer: " + fname);
	let line = 0;
	let dir = WebDAV.Fs(strs_server).dir("/books");
	for (const f of dir.children()) {
		// console.log(f);
		if (decodeURIComponent(f.name).toLocaleLowerCase() == (fname.toLocaleLowerCase() + ".progress")) {
			try {
				line = parseInt(f.read());
			} catch (e) {
				console.log("Err:" + e);
				line = 0;
			}
			break;
		}
	}
	setHistory(strs_tag + fname, line);
	localStorage.setItem(strs_file_item, fname);
	strs_file_line = strs_tag + fname + ":" + line;
	// console.log("strs_file_line:" + strs_file_line);
	return line;
}

function strs_worker() { // 定时将当前书在 localStorage 里的进度保存到服务器上
	saveProgressToServer();
	window.parent.document.title = document.title;
	setTimeout(strs_worker, 1000);
}

// hack functions
function get_func_args(func) {
	let re = /^\s*function\s*\w*\s*\(([^\)]*)\)[^{]*{.*}\s*$/si;
	let r = re.exec(func.toString());
	return r ? r[1] : "";
}
function get_func_body(func) {
	let re = /^\s*function\s*\w*\s*\([^\)]*\)[^{]*{(.*)}\s*$/si;
	let r = re.exec(func.toString());
	return r ? r[1] : "";
}
function replace_func(func_owner, func_name, func_copyname, new_func) {
	func_owner[func_copyname] = new Function(get_func_args(func_owner[func_name]), get_func_body(func_owner[func_name]));
	func_owner[func_name] = new Function(get_func_args(func_owner[func_name]), get_func_body(new_func));
}

replace_func(WebDAV, "request", "request____copy", function () {
	headers["If-Modified-Since"] = "0"; // 强制刷新，不使用缓存
	// console.log(headers);
	return this.request____copy(verb, url, headers, data, type, callback);
});

if (strs_file) {
	openFileOnServer(strs_file);
}
strs_worker();

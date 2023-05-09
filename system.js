// Asicosilomu Mobile by the all-mighty Asicosilomu!

window.System = {};
window.Activity = {};

// System Information
System.ProductName = "Asicosilomu Mobile";
System.ProductVersion = "1.3";
System.ProductCodename = "Cavicorn";

window.addEventListener("DOMContentLoaded", (e) => {

// Activity management
var main = document.body.querySelector("#view-main");

// Keep track of the Activity tree
Activity.treeIndex = 0;

// Create a fresh, empty Activity
Activity.create = function(args) {
	var act = document.createElement("div");
	act.className = "activity";
	var ab = document.createElement("div");
	ab.className = "actionbar";
	ab.innerText = args.title || "New Activity";
	var cont = document.createElement("div");
	cont.className = "activity-content";
	cont.appendChild(args.content || document.createElement("div"));
	act.appendChild(ab);
	act.appendChild(cont);
	return act;
}

// Hide all
Activity.hideAll = function() {
	var collection = main.querySelectorAll(".activity");
	for (var i = 0; i < collection.length; i++) {
		collection[i].style.display = "none";
	}
}

// Jump to
Activity.jumpTo = function(i) {
	var t = main.querySelector("#activity" + i.toString());
	if (t) {
		Activity.hideAll();
		var c = main.querySelectorAll(".activity");
		for (var j = 0; j < c.length; j++) {
			if (Number(c[j].id.split("activity")[1]) > i) {
				c[j].remove();
			}
		}
		t.style.display = "block";
		if (!t.querySelector(".actionbar")) {
			main.className = "noactionbar";
			t.querySelector(".activity-content").classList.add("noactionbar");
		} else {
			main.className = "";
		}
		Activity.treeIndex = i + 1;
	} else { throw new Error("Activity not found."); }
}

// Add an Activity to the tree
Activity.add = function(act) {
	act.id = "activity" + Activity.treeIndex.toString();
	Activity.treeIndex++;
	Activity.hideAll();
	main.appendChild(act);
	if (!act.querySelector(".actionbar")) {
		main.className = "noactionbar";
		act.querySelector(".activity-content").classList.add("noactionbar");
	} else {
		main.className = "";
	}
};

// Go to previous Activity
Activity.previous = function() {
	if (Activity.treeIndex > 1) {
		Activity.jumpTo(Activity.treeIndex - 2);
	}
}

System.Storage = {};

// Private App Storage
System.Storage.AppPrivate = {};

System.Storage.AppPrivate.Get = function (pkg) {
	if (localStorage.getItem("/storage/app-private/" + pkg) == undefined) localStorage.setItem("/storage/app-private/" + pkg, JSON.stringify({}));
	return JSON.parse(localStorage.getItem("/storage/app-private/" + pkg));
}

System.Storage.AppPrivate.Set = function (pkg, val) {
	return localStorage.setItem("/storage/app-private/" + pkg, JSON.stringify(val));
}

System.Packages = {};

// Load Settings Storage Package (Needed for Localization)
System.Packages.Core = {
	"com.asicosilomu.providers.settings": {
		"frn": "Settings Storage",
		"init": function (args) {
			var req = args.Name;
			var val = args.Value;
			var mode = args.RequestType;
			var ActivityResultPromise = args.ActivityResultPromise;
			var store = System.Storage.AppPrivate.Get("com.asicosilomu.providers.settings");
			// Set default settings, in case they're not.
			if (store.UserLocale == undefined) store.UserLocale = "en";
			System.Storage.AppPrivate.Set("com.asicosilomu.providers.settings", store);
			store = System.Storage.AppPrivate.Get("com.asicosilomu.providers.settings");
			if (mode == "GET") { ActivityResultPromise(store[req]); } else if (mode == "SET") { store[req] = val; System.Storage.AppPrivate.Set("com.asicosilomu.providers.settings", store); };
		}
	}
};

System.LaunchPackage = function(pkg, type, args) {
	var d = System.Packages[type];
	if (d) {
		var p = d[pkg];
		if (p) {
			if (!args) { args = {}; }
			var s;
			var r = new Promise(function(resolve){s=resolve;})
			args.ActivityResultPromise = s;
			try {
				p.init.apply(null, [args]);
			} catch (e) { alert(e.name, e.message); };
			return r;
		} else { throw new Error("Failed to launch "+type+" package " + pkg + ". Not installed on device."); };
	} else { throw new Error("Invalid type."); };
};

// Localization
System.Locale = {};
System.Locale.Strings = {
	"en": {
		"app_com.asicosilomu.notes": "Notes",
		"app_com.asicosilomu.providers.settings": "Settings Storage",
		"app_com.asicosilomu.mobilehome": "Asicosilomu Launcher",
		"app_com.asicosilomu.ime": "Asicosilomu Keyboard",
		"app_com.asicosilomu.browser": "Browser",
		"app_com.asicosilomu.settings": "Settings",
		"app_com.asicosilomu.fullscreen.toggle": "Fullscreen",
		"notes_newNote": "New Note",
		"notes_clearAll": "Clear All",
		"ime_space": "space",
		"ime_title": "Keyboard",
		"notes_save_ime": "save",
		"browser_go": "Go",
		"browser_go_ime": "go",
		"settings_about": "About",
		"settings_sysver": "System version",
		"settings_language": "Language",
		"settings_apps": "Apps",
		"settings_apps_core": "System",
		"app_com.asicosilomu.systemui.plugin.dialogs": "System UI Plugin - Dialogs",
		"locale_change_dlg": "For the changes to take effect, please restart your system. Close this dialog to restart.",
		"settings_apps_user": "User",
		"app_com.asicosilomu.hackysideload": "App Installer",
		"hackysideload_magicstring": "Enter the app's Magic String:",
		"hackysideload_magic": "Do the magic",
		"app_uninstall": "Uninstall",
		"app_com.asicosilomu.apps": "Asicosilomu Apps",
		"app_install": "Install",
		"app_update": "Update",
		"pkg_error_sys": "This package conflicts with an existing system package by the same name.",
		"pkg_error_key": "This package cannot be updated due to a key mismatch.",
		"pkg_error_parse": "There was a problem parsing the package."
	},
	"ro": {
		"app_com.asicosilomu.notes": "Notițe",
		"app_com.asicosilomu.providers.settings": "Stocarea datelor din Setări",
		"app_com.asicosilomu.mobilehome": "Lansator Asicosilomu",
		"app_com.asicosilomu.ime": "Tastatură Asicosilomu",
		"app_com.asicosilomu.browser": "Browser",
		"app_com.asicosilomu.settings": "Setări",
		"app_com.asicosilomu.fullscreen.toggle": "Ecran complet",
		"notes_newNote": "Notiță nouă",
		"notes_clearAll": "Eliminare tot",
		"ime_space": "spațiu",
		"ime_title": "Tastatură",
		"notes_save_ime": "salvare",
		"browser_go": "Acces",
		"browser_go_ime": "acces",
		"settings_about": "Despre",
		"settings_sysver": "Versiune sistem",
		"settings_language": "Limbă",
		"settings_apps": "Aplicații",
		"settings_apps_core": "Sistem",
		"app_com.asicosilomu.systemui.plugin.dialogs": "Plugin IU Sistem - Casete de dialog",
		"locale_change_dlg": "Pentru ca modificările să aibă efect, vă rugăm să reporniți sistemul. Închideți acest mesaj pentru a reporni.",
		"settings_apps_user": "Utilizator",
		"app_com.asicosilomu.hackysideload": "Instalator de aplicații",
		"hackysideload_magicstring": "Introduceți șirul magic al aplicației:",
		"hackysideload_magic": "Fă magie",
		"app_uninstall": "Dezinstalare",
		"app_com.asicosilomu.apps": "Aplicații Asicosilomu",
		"app_install": "Instalare",
		"app_update": "Actualizare",
		"pkg_error_sys": "Acest pachet este în conflict cu un pachet de sistem existent cu același nume.",
		"pkg_error_key": "Acest pachet nu poate fi actualizat deoarece cheile de securitate nu se potrivesc.",
		"pkg_error_parse": "A apărut o problemă la procesarea pachetului."
	}
};
System.LaunchPackage("com.asicosilomu.providers.settings", "Core", {"Name": "UserLocale", "RequestType": "GET"}).then(function(e){System.Locale.Current = e; System.Locale.Strings.Current = System.Locale.Strings[System.Locale.Current];

// Quick Localization Function
function ql(e) { return System.Locale.Strings.Current[e]; };

// User Localization
System.Locale.CreateUserQL = function (strings) {
	var cs = strings[System.Locale.Current];
	return function(e) { return cs[e]; };
}

// Localize Settings Storage App
System.Packages.Core["com.asicosilomu.providers.settings"].frn = ql("app_com.asicosilomu.providers.settings");

// Add the Other Core Apps
co = {
	"com.asicosilomu.mobilehome": {
		"frn": ql("app_com.asicosilomu.mobilehome"),
		"init": function () {
			var blacklist = ["com.asicosilomu.mobilehome", "com.asicosilomu.ime", "com.asicosilomu.providers.settings", "com.asicosilomu.systemui.plugin.dialogs"];
			var d = document.createElement("div");
			d.style.paddingTop = "10px";
			d.style.paddingLeft = "10px";
			d.style.display = "flex";
			d.style.alignItems = "top";
			d.style.justifyContent = "left";
			d.style.flexWrap = "wrap";
			var e = Object.entries(System.Packages.Core);
			function loadApps(g) {
			for (var i = 0; i < e.length; i++) {
				if (!blacklist.includes(e[i][0])) {
				var l = document.createElement("button");
				l.style.width = "100px";
				l.style.height = "100px";
				l.style.margin = "10px";
				l.innerText = e[i][1].frn;
				function t(m, g) {
					l.onclick = function () { System.LaunchPackage(m, g); };
				}
				t(e[i][0], g);
				d.appendChild(l);
				}
			}
			}
			loadApps("Core");
			e = Object.entries(System.Packages.User);
			loadApps("User");
			var launcher = Activity.create({"title": "Launcher", "content": d});
			launcher.querySelector(".activity-content").classList.add("cutekitten");
			launcher.querySelector(".actionbar").remove();
			Activity.add(launcher);
		}
	},
	"com.asicosilomu.notes": {
		"frn": ql("app_com.asicosilomu.notes"),
		"init": function () {
			var data = System.Storage.AppPrivate.Get("com.asicosilomu.notes");
			function loadNotes(notes) {
				var p = document.createElement("div");
				for (var i = notes.length - 1; i >= 0; i--) {
					var e = document.createElement("p");
					e.style.whiteSpace = "pre-wrap";
					e.innerText = notes[i];
					e.className = "listitem";
					e.classList.add("shorter");
					function st(i) {
						e.onclick = function(){System.LaunchPackage("com.asicosilomu.ime", "Core", {"text": notes[i], "submitType": ql("notes_save_ime")}).then(function(t){notes[i]=t;this.innerText=notes[i];data.notes=notes;System.Storage.AppPrivate.Set("com.asicosilomu.notes", data);Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")})};
					}
					st(i);
					p.appendChild(e);
				}
				return p;
			}
			if (data.notes == undefined) data.notes = [];
			var c = document.createElement("div");
			var n = document.createElement("button");
			n.innerText = ql("notes_newNote");
			n.style.padding = "10px";
			n.onclick = function(){data.notes.push("");System.Storage.AppPrivate.Set("com.asicosilomu.notes", data);Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")};
			c.appendChild(n);
			var da = document.createElement("button");
			da.innerText = ql("notes_clearAll");
			da.onclick = function(){System.Storage.AppPrivate.Set("com.asicosilomu.notes", {});Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")};
			c.appendChild(da);
			var p = loadNotes(data.notes);
			c.appendChild(p);
			var a = Activity.create({"title": ql("app_com.asicosilomu.notes"), "content": c});
			Activity.add(a);
		}
	},
	"com.asicosilomu.ime": {
		"frn": ql("app_com.asicosilomu.ime"),
		"init": function (args) {
			var text = args.text;
			var submitType = args.submitType;
			if (text == undefined) text = "";
			if (submitType == undefined) submitType = "submit";
			var ActivityResultPromise = args.ActivityResultPromise;
			if (typeof text != "string") text = "";
			// Keyboard layout
			var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[BKSP]", "[BREAK]", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ".", "'", "[BREAK]", "a", "s", "d", "f", "g", "h", "j", "k", "l", "!", "?", ",", "[BREAK]", "z", "x", "c", "v", "b", "n", "m", "[SHIFT]", ";", ":", "/", "[SPACEBAR]", "[RETURN]", "[SUBMIT]"];
			var isShifting = false;
			var prez;
			var prom = new Promise((resolve, reject) => {
				prez = resolve;
			});
			var c = document.createElement("div");
			c.style.height = "100%";
			c.style.width = "100%";
			var field = document.createElement("pre");
			field.style.width = "100%";
			field.style.backgroundColor = "white";
			field.innerText = text;
			var kp = document.createElement("div");
			kp.style.display = "flex";
			kp.style.justifyContent = "center";
			var keyboard = document.createElement("div");
			keyboard.style.width = "344px";
			for (var i = 0; i < keys.length; i++) {
				switch (keys[i]) {
					case "[BREAK]":
						var b = document.createElement("br");
						keyboard.appendChild(b);
						break;
					case "[SPACEBAR]":
						var s = document.createElement("button");
						s.style.width = "60%";
						s.style.padding = "10px";
						s.innerText = ql("ime_space");
						s.onclick = function() { field.innerText += " "; }
						keyboard.appendChild(s);
						break;
					case "[SHIFT]":
						var b = document.createElement("button");
						b.style.padding = "10px";
						b.innerText = "shift";
						b.onclick = function(){isShifting=!isShifting;this.innerText=isShifting.toString();};
						keyboard.appendChild(b);
						break;
					case "[SUBMIT]":
						var b = document.createElement("button");
						b.innerText = submitType;
						b.onclick = function(){prez(field.innerText);};
						b.style.padding = "10px";
						keyboard.appendChild(b);
						break;
					case "[BKSP]":
						var b = document.createElement("button");
						b.innerText = "<-";
						b.onclick = function(){if(field.innerText.length > 0){field.innerText = field.innerText.substr(0, field.innerText.length - 1);}};
						b.style.padding = "10px";
						keyboard.appendChild(b);
						break;
					case "[RETURN]":
						var b = document.createElement("button");
						b.onclick = function(){field.innerText += "\n";};
						b.innerText = "return";
						b.style.padding = "10px";
						keyboard.appendChild(b);
						break;
					default:
						var button = document.createElement("button");
						button.style.padding = "10px";
						button.innerText = keys[i];
						button.onclick = function() { if (!isShifting) { field.innerText += this.innerText; } else { field.innerText += this.innerText.toUpperCase(); }; };
						keyboard.appendChild(button);
						break;
				}
			}
			c.appendChild(field);
			kp.appendChild(keyboard);
			c.appendChild(kp);
			var act = Activity.create({"title": ql("ime_title"), "content": c});
			Activity.add(act);
			prom.then(function(v){Activity.previous();ActivityResultPromise(v);});
		}
	},
	"com.asicosilomu.browser": {
		"frn": ql("app_com.asicosilomu.browser"),
		"init": function () {
			var START_URL = "https://asicosilomu.github.io/asicosilomu/";
			var c = document.createElement("div");
			c.style.height = "100%";
			c.style.width = "100%";
			var addr = document.createElement("p");
			function st(a) { addr.innerText = a; ifr.src = a;addr.parentElement.parentElement.parentElement.querySelector(".actionbar").innerText = ifr.src + " - Browser"; };
			addr.onclick = function () { System.LaunchPackage("com.asicosilomu.ime", "Core", {"text": this.innerText, "submitType": ql("browser_go_ime")}).then(function(r){st(r);}); };
			addr.className = "EditText";
			addr.style.width = "90%";
			addr.style.padding = "10px";
			addr.style.margin = "0px";
			addr.innerText = START_URL;
			var ifr = document.createElement("iframe");
			ifr.style.width = "100%";
			ifr.style.border = "none";
			ifr.style.backgroundColor = "white";
			ifr.style.height = "1000000px";
			ifr.src = START_URL;
			var rel = document.createElement("button");
			rel.style.padding = "10px";
			rel.innerText = ql("browser_go");
			rel.onclick = function(){ifr.src=ifr.src;this.parentElement.parentElement.parentElement.querySelector(".actionbar").innerText = ifr.src + " - Browser";};
			c.appendChild(addr);
			c.appendChild(rel);
			c.appendChild(ifr);
			var act = Activity.create({"title": START_URL + " - Browser", "content": c});
			Activity.add(act);
		}
	},
	"com.asicosilomu.settings": {
		"frn": ql("app_com.asicosilomu.settings"),
		"init": function () {
			// Easy reading/saving of settings
			function sread(n) { return System.LaunchPackage("com.asicosilomu.providers.settings", "Core", {"Name": n, "RequestType": "GET"}); };
			function ssave(n, v) { return System.LaunchPackage("com.asicosilomu.providers.settings", "Core", {"Name": n, "Value": v, "RequestType": "SET"}); };
			var settings = [
				{
					"frn": ql("settings_apps"),
					"init": function () {
						var m = document.createElement("div");	
						var corebtn = document.createElement("button");
						corebtn.onclick = function () {
							var n = document.createElement("div");
							var p = Object.entries(System.Packages.Core);
							for (var i = 0; i < p.length; i++) {
								var o = document.createElement("button");
								o.innerHTML = `<b>${p[i][1].frn}</b>&nbsp;${p[i][0]}`;
								o.className = "listitem";
								n.appendChild(o);
							}
							Activity.add(Activity.create({"title": `${ql("settings_apps")}: ${ql("settings_apps_core")}`, "content": n}));
						};
						corebtn.innerText = ql("settings_apps_core");
						corebtn.className = "listitem";
						m.appendChild(corebtn);
						var userbtn = document.createElement("button");
						userbtn.onclick = function () {
							var n = document.createElement("div");
							var p = Object.entries(System.Packages.User);
							for (var i = 0; i < p.length; i++) {
								var o = document.createElement("button");
								o.innerHTML = `<b>${p[i][1].frn}</b>&nbsp;${p[i][0]}&nbsp;&nbsp;`;
								o.className = "listitem";
								var q = document.createElement("button");
								function as(p) { q.onclick = function(){System.Packages.removeUserPackage(p)}; };
								as(p[i][0]);
								q.innerText = ql("app_uninstall");
								o.appendChild(q);
								n.appendChild(o);
							}
							Activity.add(Activity.create({"title": `${ql("settings_apps")}: ${ql("settings_apps_user")}`, "content": n}));
						};
						userbtn.innerText = ql("settings_apps_user");
						userbtn.className = "listitem";
						m.appendChild(userbtn);
						Activity.add(Activity.create({"title": ql("settings_apps"), "content": m}));
					}
				},
				{
					"frn": ql("settings_about"),
					"init": function() { 
						var m = document.createElement("div");
						var properties = [
							{
								"name": "User-Agent",
								"value": window.navigator.userAgent
							},
							{
								"name": ql("settings_sysver"),
								"value": `${System.ProductName} ${System.ProductVersion} "${System.ProductCodename}"`
							}
						];
						for (var i = 0; i < properties.length; i++) {
							var e = document.createElement("button");
							e.className = "listitem";
							e.innerHTML = `<span><b>${properties[i].name}: </b>${properties[i].value}</span>`;
							m.appendChild(e);
						}
						var a = Activity.create({"title": ql("settings_about"), "content": m});
						Activity.add(a);
					}
				},
				{
					"frn": ql("settings_language"),
					"init": function () {
						var langs = [["English", "en"], ["Română", "ro"]];
						var m = document.createElement("div");
						for (var i = 0; i < langs.length; i++) {
							var e = document.createElement("button");
							e.className = "listitem";
							e.innerText = langs[i][0];
							function sv(b, l) {
								b.onclick = function() { ssave("UserLocale", l); Activity.previous = function(){window.location.reload()}; Activity.jumpTo = Activity.previous; System.LaunchPackage("com.asicosilomu.systemui.plugin.dialogs", "Core", {"title": ql("settings_language"), "text": ql("locale_change_dlg")}); };
							}
							sv(e, langs[i][1]);
							m.appendChild(e);
						}
						Activity.add(Activity.create({"title": ql("settings_language"), "content": m}));
					}
				}
			];
			var c = document.createElement("div");
			for (var i = 0; i < settings.length; i++)
			{
				var item = document.createElement("button");
				item.className = "listitem";
				item.innerText = settings[i].frn;
				item.onclick = settings[i].init;
				c.appendChild(item);
			}
			var a = Activity.create({"title": ql("app_com.asicosilomu.settings"), "content": c});
			Activity.add(a);
		}
	},
	"com.asicosilomu.demo": {
		"frn": "Demo App",
		"init": function () {
			var d = document.createElement("div");
			d.innerHTML = "Type some text in the field below:<br>";
			var b = document.createElement("p");
			b.className = "EditText";
			b.innerText = "Type some text!";
			function st(a) { b.innerText = a; };
			b.onclick = function () { System.LaunchPackage("com.asicosilomu.ime", "Core", {"text": this.innerText, "submitType": "DEMO!"}).then(function(r){st(r);}); };
			d.appendChild(b);
			var a = Activity.create({"title": "Keyboard Demo", "content": d});
			Activity.add(a);
		}
	},
	"com.asicosilomu.systemui.plugin.dialogs": {
		"frn": ql("app_com.asicosilomu.systemui.plugin.dialogs"),
		"init": function (args) {
			var c = document.createElement("div");
			c.style.backgroundColor = "white";
			c.style.margin = "15px";
			var b = document.createElement("b");
			b.innerText = args.title || "Untitled";
			var p = document.createElement("p");
			p.innerText = args.text || "Dialog text not provided.";
			var ok = document.createElement("button");
			ok.innerText = args.oktext || "OK";
			ok.onclick = Activity.previous;
			c.appendChild(b);
			c.appendChild(p);
			c.appendChild(ok);
			c.style.padding = "15px";
			c.style.borderRadius = "5px";
			c.style.marginBottom = "50px";
			var a = Activity.create({"title": ql("app_com.asicosilomu.systemui.plugin.dialogs"), "content": c});
			a.querySelector(".actionbar").remove()
			var ac = a.querySelector(".activity-content");
			ac.style.setProperty("background-color", "black", "important");
			ac.style.display = "flex";
			ac.style.alignItems = "center";
			ac.style.justifyContent = "center";
			Activity.add(a);
		}
	},
	"com.asicosilomu.hackysideload": {
		"frn": ql("app_com.asicosilomu.hackysideload"),
		"init": function() {
			var c = document.createElement("center");
			var p = document.createElement("p");
			p.innerText = ql("hackysideload_magicstring");
			var f = document.createElement("textarea");
			f.placeholder = "MagicString";
			f.style.resize = "vertical";
			f.style.width = "95%";
			f.style.marginBottom = "10px";
			var m = document.createElement("button");
			m.innerText = ql("hackysideload_magic");
			m.onclick = function() { System.Packages.addUserPackage(f.value); };
			c.style.paddingTop = "10px";
			c.appendChild(p);
			c.appendChild(f);
			c.appendChild(m);
			Activity.add(Activity.create({"title": ql("app_com.asicosilomu.hackysideload"), "content": c}));
		}
	},
	"com.asicosilomu.apps": {
		"frn": ql("app_com.asicosilomu.apps"),
		"init": function() {
			var c = document.createElement("div");
			var appList = [
				{"frn":{"en":"Reset Welcome Message","ro":"Reset. mesaj bun venit"},"desc":{"ro":"Îți permite să vezi din nou mesajul de bun venit.","en":"Allows you to view the first boot welcome message again."},"pkg":"com.asicosilomu.welreset","init":"return function(){var uql=System.Locale.CreateUserQL({'en':{'done':'Done!','m':'The welcome message will be shown on next boot.'},'ro':{'done':'Gata!','m':'Mesajul de bun venit va fi afișat la următoarea pornire.'}});localStorage.removeItem('welShown');alert(uql('done'),uql('m'))}","key":"WELRESET316357465"},
				{"pkg":"com.asicosilomu.pkgexport","desc":{"en":"Simple app for getting the MagicStrings of installed user apps, which can be used to reinstall them later.","ro":"Aplicație simplă pentru a face rost de MagicString-urile aplicațiilor instalate ca utilizator, care pot fi utilizate pentru a le reinstala ulterior."},"frn":{"en":"Package Export","ro":"Export pachete"},"init":"return function(){\r\nvar locStrings = {\r\n\t\"en\": {\r\n\t\t\"appname\": \"Package Export\",\r\n\t\t\"export\": \"Export\",\r\n\t\t\"for\": \"for\"\r\n\t},\r\n\t\"ro\": {\r\n\t\t\"appname\": \"Export pachete\",\r\n\t\t\"export\": \"Exportare\",\r\n\t\t\"for\": \"pentru\"\r\n\t}\r\n};\r\nvar uql = System.Locale.CreateUserQL(locStrings);\r\nvar n = document.createElement(\"div\");\r\nvar l = JSON.parse(localStorage.getItem(\"UserPackages\"));\r\nvar p = Object.entries(l);\r\nfor (var i = 0; i < p.length; i++) {\r\nvar o = document.createElement(\"button\");\r\no.innerHTML = `<b>${System.Packages.User[p[i][0]].frn}</b>&nbsp;${p[i][0]}&nbsp;&nbsp;`;\r\no.className = \"listitem\";\r\nvar q = document.createElement(\"button\");\r\nfunction as(p) { q.onclick = function(){var z = document.createElement(\"textarea\");z.style.width=\"95%\";z.style.height=\"1000000px\";z.style.resize=\"none\";z.disabled=true;var y = structuredClone(p[1]);y.pkg=p[0];z.value=JSON.stringify(y);Activity.add(Activity.create({'title':`MagicString ${uql(\"for\")} ${p[0]}`,'content':z}))}};\r\nas(p[i]);\r\nq.innerText = uql(\"export\");\r\no.appendChild(q);\r\nn.appendChild(o);\r\n}\r\nActivity.add(Activity.create({\"title\": uql(\"appname\"), \"content\": n}));}\r\n","key":"PKGEXPORT122198635"},
				{"pkg":"com.asicosilomu.istorie","desc":{"ro":"Un joc tip text-adventure în care dai un test la istorie."},"frn":"Testul la Istorie","init":"return function(){var i = document.createElement('iframe');i.src='data:text/html;charset=utf-8;base64,PCFET0NUWVBFIGh0bWw+DQo8aHRtbD4NCgk8aGVhZD4NCgkJPHRpdGxlPlRlc3R1bCBsYSBJc3RvcmllIC0gVGV4dCBBZHZlbnR1cmU8L3RpdGxlPg0KCQk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCQkJKiB7IGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEuMWVtOyB9DQoJCQkNCgkJCWJvZHkgew0KCQkJCWJhY2tncm91bmQtY29sb3I6IGJsYWNrOw0KCQkJCWRpc3BsYXk6IGZsZXg7DQoJCQkJYWxpZ24taXRlbXM6IGNlbnRlcjsNCgkJCQlqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsNCgkJCQl3aWR0aDogMTAwdnc7DQoJCQkJaGVpZ2h0OiAxMDB2aDsNCgkJCQltYXJnaW46IDBweDsNCgkJCQljb2xvcjogd2hpdGU7DQoJCQl9DQoJCQkNCgkJCSNjb250YWluZXIgew0KCQkJCWJhY2tncm91bmQtY29sb3I6IHdoaXRlOw0KCQkJCWNvbG9yOiBibGFjayAhaW1wb3J0YW50Ow0KCQkJCXBhZGRpbmc6IDE1cHg7DQoJCQl9DQoJCQkNCgkJCSNidXR0b24tY29udGFpbmVyIHsNCgkJCQlkaXNwbGF5OiBmbGV4Ow0KCQkJCW1hcmdpbi10b3A6IDE1cHg7DQoJCQkJYWxpZ24taXRlbXM6IGNlbnRlcjsNCgkJCQlqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsNCgkJCX0NCgkJCQ0KCQkJYnV0dG9uIHsNCgkJCQltYXJnaW46IDVweDsNCgkJCX0NCgkJPC9zdHlsZT4NCgkJPHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiPg0KCQl3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigiRE9NQ29udGVudExvYWRlZCIsIChlKSA9PiB7DQoJCQ0KCQkJLy8gVGVzdCBJc3RvcmllIEhhaGENCgkJCXZhciBjb250YWluZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoIiNjb250YWluZXIiKTsNCgkJCXZhciBwcm9tcHQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigiI3Byb21wdCIpOw0KCQkJdmFyIGJ0bmNvbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigiI2J1dHRvbi1jb250YWluZXIiKTsNCgkJCQ0KCQkJLy8gUG92ZXN0ZQ0KCQkJdmFyIHByb21wdHMgPSB7DQoJCQkJInRleHQiOiAiU8SDcHTEg23Dom5hIHZpaXRvYXJlIHZlaSBkYSB1biB0ZXN0IGxhIElzdG9yaWUuIEN1bSB0ZSBwcmVnxIN0ZciZdGk/IiwNCgkJCQkib3B0aW9ucyI6IFsNCgkJCQkJew0KCQkJCQkJInRleHQiOiAiRsSDIGNvcGl1yJtlIiwNCgkJCQkJCSJvdXRjb21lIjogew0KCQkJCQkJCSJ0ZXh0IjogIkFpIGbEg2N1dCBjb3BpdcibZWxlIMiZaSBsZS1haSBixINnYXQgbGEgYm96b25hci4gQSB2ZW5pdCB0aW1wdWwgdGVzdHVsdWkhIiwNCgkJCQkJCQkib3B0aW9ucyI6IFsNCgkJCQkJCQkJew0KCQkJCQkJCQkJInRleHQiOiAiTWVyZ2kgbGEgyJljb2FsxIMiLA0KCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJInRleHQiOiAiQWkgZGF0IHRlc3R1bCBkb2FyIGPEgyBkb21udWwgZGUgSXN0b3JpZSB0ZS1hIHByaW5zIGN1IGNvcGl1yJtlbGUuIEFpIHByaW1pdCBub3RhIDEuIFRlIHN1bsSDIG1hbWEgyJlpIHRlIMOubnRyZWFixIMgY2UgYWkgZsSDY3V0IGxhIMiZY29hbMSDLiIsDQoJCQkJCQkJCQkJIm9wdGlvbnMiOiBbDQoJCQkJCQkJCQkJCXsNCgkJCQkJCQkJCQkJCSJ0ZXh0IjogIlRhY2kgZGluIGd1csSDIiwNCgkJCQkJCQkJCQkJCSJvdXRjb21lIjogew0KCQkJCQkJCQkJCQkJCSJ0ZXh0IjogIkFpIHTEg2N1dCBkaW4gZ3VyxIMgaWFyIG1hbWEgbnUgYSBhZmxhdC4gQWkgc2PEg3BhdCEiLA0KCQkJCQkJCQkJCQkJCSJvcHRpb25zIjogW10NCgkJCQkJCQkJCQkJCX0NCgkJCQkJCQkJCQkJfSwNCgkJCQkJCQkJCQkJew0KCQkJCQkJCQkJCQkJInRleHQiOiAiU3B1bmUtaSBkZSB0ZXN0IiwNCgkJCQkJCQkJCQkJCSJvdXRjb21lIjogew0KCQkJCQkJCQkJCQkJCSJ0ZXh0IjogIk1hbWEgdGUgw65udHJlYWLEgyBjZSBub3TEgyBhaSBsdWF0LiIsDQoJCQkJCQkJCQkJCQkJIm9wdGlvbnMiOiBbDQoJCQkJCQkJCQkJCQkJCXsNCgkJCQkJCQkJCQkJCQkJCSJ0ZXh0IjogIlNwdW5lLWkgY8SDIG51IHMtYXUgZGF0IMOubmPEgyByZXp1bHRhdGVsZSIsDQoJCQkJCQkJCQkJCQkJCQkib3V0Y29tZSI6IHsNCgkJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJNYW1hIGEgdWl0YXQgZXZlbnR1YWwgZGUgdGVzdCBpYXIgbm90YSB0YSBudSBhIGZvc3QgYWZsYXTEgy4gQnJhdm8hIg0KCQkJCQkJCQkJCQkJCQkJfQ0KCQkJCQkJCQkJCQkJCQl9LA0KCQkJCQkJCQkJCQkJCQl7DQoJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJTcHVuZS1pIGFkZXbEg3J1bCIsDQoJCQkJCQkJCQkJCQkJCQkib3V0Y29tZSI6IHsNCgkJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJNYW1hIHMtYSBzdXDEg3JhdCBmb2FydGUgdGFyZSDImWkgYSBhcnVuY2F0IGN1IG1hc2EgZGluIGJ1Y8SDdMSDcmllLiBQZXJlyJtpaSBzZW5zaWJpbGkgYWkgY2FzZWkgbnUgYXUgc3Vwb3J0YXQgZm9yyJthIGlhciB0b2F0xIMgY2FzYSBzLWEgZsSDY3V0IGJ1Y8SDyJtlbGUuIFRvyJtpIGHIm2kgcsSDbWFzIHBlIHN0csSDemkuIg0KCQkJCQkJCQkJCQkJCQkJfQ0KCQkJCQkJCQkJCQkJCQl9LA0KCQkJCQkJCQkJCQkJCQl7DQoJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJTcHVuZS1pIGPEgyBhaSBsdWF0IDEwIiwNCgkJCQkJCQkJCQkJCQkJCSJvdXRjb21lIjogew0KCQkJCQkJCQkJCQkJCQkJCSJ0ZXh0IjogIk1hbWEgdGUgZmVsaWNpdMSDLCBkYXIgdG90dciZaSBudSB0ZSBjcmVkZS4gRWEgZXN0ZSBwZSBjYWxlIHPEgyDDrmwgdGVsZWZvbmV6ZSBwZSBkb21udWwgZGUgSXN0b3JpZSBwZW50cnUgYSBjb25maXJtYS4iLA0KCQkJCQkJCQkJCQkJCQkJCSJvcHRpb25zIjogWw0KCQkJCQkJCQkJCQkJCQkJCQl7DQoJCQkJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJMYXMtbyBzxIMgw65sIHRlbGVmb25lemUiLA0KCQkJCQkJCQkJCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJCQkJCQkJCQkJInRleHQiOiAiTWFtYSBsLWEgdGVsZWZvbmF0IHBlIGRvbW51bCBkZSBJc3RvcmllIGlhciBhY2VzdGEgaS1hIHNwdXMgYWRldsSDcnVsLiBWYSB0cmVidWkgc8SDIGZvbG9zZciZdGkgR05PTUUgcGVudHJ1IG8gbHVuxIMuIg0KCQkJCQkJCQkJCQkJCQkJCQkJfQ0KCQkJCQkJCQkJCQkJCQkJCQl9LA0KCQkJCQkJCQkJCQkJCQkJCQl7DQoJCQkJCQkJCQkJCQkJCQkJCQkidGV4dCI6ICJTcHVuZS1pIHPEgyBhyJl0ZXB0ZSBwdcibaW4iLA0KCQkJCQkJCQkJCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJCQkJCQkJCQkJInRleHQiOiAiTWFtYSBhyJl0ZWFwdMSDLiBDZSBmYWNpPyIsDQoJCQkJCQkJCQkJCQkJCQkJCQkJIm9wdGlvbnMiOiBbDQoJCQkJCQkJCQkJCQkJCQkJCQkJCXsNCgkJCQkJCQkJCQkJCQkJCQkJCQkJCSJ0ZXh0IjogIlNwdW5lLWkgYWRldsSDcnVsIiwNCgkJCQkJCQkJCQkJCQkJCQkJCQkJCSJvdXRjb21lIjogeyAidGV4dCI6ICJNYWkgYmluZSDDrmkgc3B1bmVhaSBkZSBsYSDDrm5jZXB1dC4gyJh0aWkgY2Ugc2Ugw65udMOibXBsxIMgYWN1bS4iIH0NCgkJCQkJCQkJCQkJCQkJCQkJCQkJfSwNCgkJCQkJCQkJCQkJCQkJCQkJCQkJew0KCQkJCQkJCQkJCQkJCQkJCQkJCQkJInRleHQiOiAiRMSDLWkgyJlwYWfEgyBsdWkgZG9tbnVsIGRlIElzdG9yaWUgc8SDIMOuaSBzcHVuxIMgY8SDIGFpIGx1YXQgMTAiLA0KCQkJCQkJCQkJCQkJCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJCQkJCQkJCQkJCQkJInRleHQiOiAiyJppLWFpIGdvbGl0IHB1yJljdWxpyJthIMiZaSBpLWFpIGRhdCBkb21udWx1aSBkZSBJc3RvcmllIDEwMCBkZSBsZWkgyJlwYWfEgy4gQWkgc2PEg3BhdCEiDQoJCQkJCQkJCQkJCQkJCQkJCQkJCQl9DQoJCQkJCQkJCQkJCQkJCQkJCQkJCX0NCgkJCQkJCQkJCQkJCQkJCQkJCQldDQoJCQkJCQkJCQkJCQkJCQkJCQl9DQoJCQkJCQkJCQkJCQkJCQkJCX0NCgkJCQkJCQkJCQkJCQkJCQldDQoJCQkJCQkJCQkJCQkJCQl9DQoJCQkJCQkJCQkJCQkJCX0NCgkJCQkJCQkJCQkJCQldDQoJCQkJCQkJCQkJCQl9DQoJCQkJCQkJCQkJCX0NCgkJCQkJCQkJCQldDQoJCQkJCQkJCQl9DQoJCQkJCQkJCX0NCgkJCQkJCQldDQoJCQkJCQl9DQoJCQkJCX0sDQoJCQkJCXsNCgkJCQkJCSJ0ZXh0IjogIsOObnZhyJvEgyIsDQoJCQkJCQkib3V0Y29tZSI6IHsNCgkJCQkJCQkidGV4dCI6ICJBaSBzdGF0IG8gemkgw65udHJlYWfEgyBzxIMgdG9jZciZdGkgY2VsZSA2IHBhZ2luaSBkZSBpbmZvcm1hyJtpaSBpbnV0aWxlLiBFyJl0aSBwcmVnxIN0aXQuIiwNCgkJCQkJCQkib3B0aW9ucyI6IFsNCgkJCQkJCQkJew0KCQkJCQkJCQkJInRleHQiOiAiTWVyZ2kgbGEgyJljb2FsxIMiLA0KCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJInRleHQiOiAiQWkgZGF0IHRlc3R1bCDImWkgYWkgbHVhdCBub3RhIDEwLiBDZSBmYWNpPyIsDQoJCQkJCQkJCQkJIm9wdGlvbnMiOiBbDQoJCQkJCQkJCQkJCXsNCgkJCQkJCQkJCQkJCSJ0ZXh0IjogIlNwdW5lLWkgbWFtZWkiLA0KCQkJCQkJCQkJCQkJIm91dGNvbWUiOiB7ICJ0ZXh0IjogIk1hbWEgZXN0ZSBmb2FydGUgbcOibmRyxIMgZGUgdGluZSEgVmVpIHByaW1pIDEwMCBkZSBsZWkuIiB9DQoJCQkJCQkJCQkJCX0sDQoJCQkJCQkJCQkJCXsNCgkJCQkJCQkJCQkJCSJ0ZXh0IjogIlRhY2kgZGluIGd1csSDIiwNCgkJCQkJCQkJCQkJCSJvdXRjb21lIjogeyAidGV4dCI6ICJOLWFtIG1haSB2xIN6dXQgYciZYSBwcm9zdCBjYSB0aW5lLiIgfQ0KCQkJCQkJCQkJCQl9DQoJCQkJCQkJCQkJXQ0KCQkJCQkJCQkJfQ0KCQkJCQkJCQl9DQoJCQkJCQkJXQ0KCQkJCQkJfQ0KCQkJCQl9LA0KCQkJCQl7DQoJCQkJCQkidGV4dCI6ICJOdSB0ZSBwcmVnxIN0aSIsDQoJCQkJCQkib3V0Y29tZSI6IHsNCgkJCQkJCQkidGV4dCI6ICJOdSB0ZS1haSBwcmVnxIN0aXQgZGVsb2MuIEFjdW0gZXN0ZSBwcmVhIHTDonJ6aXUgc8SDIHRlIHLEg3pnw6JuZGXImXRpLi4uIiwNCgkJCQkJCQkib3B0aW9ucyI6IFsNCgkJCQkJCQkJew0KCQkJCQkJCQkJInRleHQiOiAiTWVyZ2kgbGEgyJljb2FsxIMiLA0KCQkJCQkJCQkJIm91dGNvbWUiOiB7DQoJCQkJCQkJCQkJInRleHQiOiAiQWkgZGF0IHRlc3R1bCDImWkgYWkgbHVhdCAyLiBUZSBzdW7EgyBtYW1hIMiZaSB0ZSDDrm50cmVhYsSDIGNlIGFpIGbEg2N1dCBsYSDImWNvYWzEgy4iLA0KCQkJCQkJCQkJCSJvcHRpb25zIjogew0KCQkJCQkJCQkJCX0NCgkJCQkJCQkJCX0NCgkJCQkJCQkJfQ0KCQkJCQkJCV0NCgkJCQkJCX0NCgkJCQkJfQ0KCQkJCV0NCgkJCX0NCgkJCQ0KCQkJdmFyIHAgPSBwcm9tcHRzOw0KCQkJDQoJCQlmdW5jdGlvbiBsb2FkKCkgew0KCQkJCXByb21wdC5pbm5lclRleHQgPSBwLnRleHQ7DQoJCQkJYnRuY29udC5pbm5lckhUTUwgPSAiIjsNCgkJCQlmb3IgKHZhciBpID0gMDsgaSA8IHAub3B0aW9ucy5sZW5ndGg7IGkrKykgew0KCQkJCQl2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYnV0dG9uIik7DQoJCQkJCWJ1dHRvbi5pbm5lclRleHQgPSBwLm9wdGlvbnNbaV0udGV4dDsNCgkJCQkJZnVuY3Rpb24gcyhvKSB7DQoJCQkJCQlidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkgew0KCQkJCQkJCXAgPSBwLm9wdGlvbnNbb10ub3V0Y29tZTsNCgkJCQkJCQlsb2FkKCk7DQoJCQkJCQl9DQoJCQkJCX0NCgkJCQkJcyhpKTsNCgkJCQkJYnRuY29udC5hcHBlbmRDaGlsZChidXR0b24pOw0KCQkJCX0NCgkJCX0NCgkJCQ0KCQkJbG9hZCgpOw0KCQl9KTsNCgkJPC9zY3JpcHQ+DQoJPC9oZWFkPg0KCTxib2R5Pg0KCQk8ZGl2IGlkPSJjb250YWluZXIiPg0KCQkJPGkgaWQ9InByb21wdCI+QWkgdGVzdCBsYSBpc3RvcmllLiDImGkgbmljaSBKYXZhU2NyaXB0IG51IGFpIGFjdGl2YXQuPC9pPg0KCQkJPGRpdiBpZD0iYnV0dG9uLWNvbnRhaW5lciI+PC9kaXY+DQoJCTwvZGl2Pg0KCTwvYm9keT4NCjwvaHRtbD4=';i.style.width='100%';i.style.border='none';i.style.height='95%';var a = Activity.create({'title':'Testul la Istorie','content':i});a.querySelector('.actionbar').remove();Activity.add(a);}","key":"JTAISTORIE220633637"}
			];
			for (var i = 0; i < appList.length; i++) {
				var b = document.createElement("button");
				frn = undefined;
				if (typeof appList[i].frn == "object"){ var frn = appList[i].frn[System.Locale.Current];
				if (frn == undefined) frn = appList[i].frn.en;
				}
				var iou = ql("app_install");
				if (System.Packages.User[appList[i].pkg] != undefined) iou = ql("app_update");
				b.innerHTML = `<b>${frn || appList[i].frn || appList[i].pkg}</b>&nbsp;${appList[i].pkg}&nbsp;&nbsp;<button>${iou}</button>`;
				var d = b.querySelector("button");
				b.className = "listitem";
				b.style.borderBottom = "none";
				var desc = document.createElement("i");
				desc.innerText = appList[i].desc[System.Locale.Current] || appList[i].desc.en || "No description provided.";
				desc.style.borderTop = "none";
				desc.className = "listitem";
				desc.style.width = "calc(100% - 42px)";
				desc.style.height = "auto";
				desc.style.paddingTop = "0px";
				desc.style.paddingBottom = "15px";
				desc.style.paddingRight = "20px";
				delete appList[i].desc;
				function bind(ms) {
					d.onclick = function(){System.Packages.addUserPackage(ms);};
				};
				bind(JSON.stringify(appList[i]));
				c.appendChild(b);
				c.appendChild(desc);
			}
			Activity.add(Activity.create({"title": ql("app_com.asicosilomu.apps"), "content": c}));
		}
	},
	"com.asicosilomu.fullscreen.toggle": {
		"frn": ql("app_com.asicosilomu.fullscreen.toggle"),
		"init": function () {
			function openFullscreen(elem){if(elem.requestFullscreen){elem.requestFullscreen()}else if(elem.webkitRequestFullscreen){elem.webkitRequestFullscreen()}else if(elem.msRequestFullscreen){elem.msRequestFullscreen()}};
			var a = Activity.create({"title": ql("app_com.asicosilomu.fullscreen.toggle"), "content": document.createElement("div")});
			Activity.add(a);
			openFullscreen(document.documentElement);
			setTimeout(Activity.previous, 250);
		}
	},
	"com.asicosilomu.promotion.github": {
		"frn": "GitHub",
		"init": function () {
			window.open("https://github.com/asicosilomu/asicosilomu-mobile");
		}
	}
}

co["com.asicosilomu.providers.settings"] = System.Packages.Core["com.asicosilomu.providers.settings"];
System.Packages.Core = co;

// Add User Apps
if (localStorage.getItem("UserPackages") == null) localStorage.setItem("UserPackages", JSON.stringify({}));

System.Packages.loadUserPackages = function() {
	var userpkg = JSON.parse(localStorage.getItem("UserPackages"));
	var ent = Object.entries(userpkg);
	for (var i = 0; i < ent.length; i++) {
		try {
			//if (userpkg[ent[i][0]].frn.substr(0,1) == "{" && userpkg[ent[i][0]].frn.substr(userpkg[ent[i][0].frn.length - 1, 1]) == "}") userpkg[ent[i][0]].frn = JSON.parse(userpkg[ent[i][0]].frn);
			if (typeof userpkg[ent[i][0]].frn == "object") {
				userpkg[ent[i][0]].frn = userpkg[ent[i][0]].frn[System.Locale.Current] || userpkg[ent[i][0]].frn.en || userpkg[ent[i][0]].pkg;
			}
			userpkg[ent[i][0]].init = new Function(userpkg[ent[i][0]].init)();
		} catch (e) { setTimeout(function(){System.LaunchPackage("com.asicosilomu.systemui.plugin.dialogs", "Core", {"title": e.name, "text": e.message})},1); };
	};
	System.Packages.User = userpkg;
};

System.Packages.loadUserPackages();

// Add function
System.Packages.addUserPackage = function(ms) {
	try {
		var thing = JSON.parse(ms);
		var pkg = thing.pkg;
		if (pkg == undefined || thing.frn == undefined || thing.init == undefined) throw new Error(ql("pkg_error_parse"));
		delete thing.pkg;
		var ua = JSON.parse(localStorage.getItem("UserPackages"));
		if (System.Packages.Core[pkg] != undefined) throw new Error(ql("pkg_error_sys"));
		if (ua[pkg] != undefined && thing.key != ua[pkg].key) throw new Error(ql("pkg_error_key"));
		ua[pkg] = thing;
		localStorage.setItem("UserPackages", JSON.stringify(ua));
		Activity.previous = function(){window.location.reload()}; Activity.jumpTo = Activity.previous; alert(ql("app_com.asicosilomu.hackysideload"), ql("locale_change_dlg"));
	} catch(e) { alert(e.name, e.message); };
}

// Rem function
System.Packages.removeUserPackage = function(pkg) {
	var data = JSON.parse(localStorage.getItem("UserPackages"));
	if (data[pkg]) delete data[pkg];
	localStorage.setItem("UserPackages", JSON.stringify(data));
	System.Storage.AppPrivate.Set(pkg, {});
	Activity.previous = function(){window.location.reload()}; Activity.jumpTo = Activity.previous; alert(ql("app_com.asicosilomu.hackysideload"), ql("locale_change_dlg"));
}

// System UI

// Navigation Buttons
var navbutton_back = document.body.querySelector("#navbutton-back");
navbutton_back.onclick = function(){ Activity.previous(); };

var navbutton_home = document.body.querySelector("#navbutton-home");
navbutton_home.onclick = function() { Activity.jumpTo(0); };

// Dialog Boxes
window.alert = function (title, text) {
	System.LaunchPackage("com.asicosilomu.systemui.plugin.dialogs", "Core", {"title": title, "text": text});
}

// Start-up Sequence

// Start the Launcher
System.LaunchPackage("com.asicosilomu.mobilehome", "Core");

// Welcome Message
if (localStorage.getItem("welShown") == null) {
	var wql = System.Locale.CreateUserQL({
		"en": {
			"wel": "Welcome!",
			"m": "Asicosilomu Mobile is an Android-inspired web-based operating system. Updates are released frequently, and there's many more cool things on the horizon! Feel free to click around and explore."
		},
		"ro": {
			"wel": "Bun venit!",
			"m": "Asicosilomu Mobile este un sistem de operare web-based inspirat de Android. Acesta este actualizat frecvent, și sunt mult mai multe lucruri tari în plan! Acum te voi lăsa să explorezi, simte-te ca acasă."
		}
	});
	alert(wql("wel"), wql("m"));
	localStorage.setItem("welShown", true);
}

// End Localization Wrapper
});

});

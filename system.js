// Asicosilomu Mobile by the all-mighty Asicosilomu!

window.System = {};
window.Activity = {};

// System Information
System.ProductName = "Asicosilomu Mobile";
System.ProductVersion = "1.1";

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

// Core System Apps
System.Packages.Core = {
	"com.asicosilomu.mobilehome": {
		"frn": "Launcher",
		"init": function () {
			var blacklist = ["com.asicosilomu.mobilehome", "com.asicosilomu.ime"];
			var c = document.createElement("div");
			c.style.paddingTop = "10px";
			var d = document.createElement("center");
			c.appendChild(d);
			var e = Object.entries(System.Packages.Core);
			for (var i = 0; i < e.length; i++) {
				if (!blacklist.includes(e[i][0])) {
				var l = document.createElement("button");
				l.style.width = "100px";
				l.style.height = "100px";
				l.style.margin = "10px";
				l.innerText = e[i][1].frn;
				function t(m) {
					l.onclick = function () { System.LaunchPackage(m, "Core"); };
				}
				t(e[i][0]);
				d.appendChild(l);
				}
			}
			var launcher = Activity.create({"title": "Launcher", "content": c});
			launcher.querySelector(".activity-content").classList.add("cutekitten");
			launcher.querySelector(".actionbar").remove();
			Activity.add(launcher);
		}
	},
	"com.asicosilomu.notes": {
		"frn": "Notes",
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
						e.onclick = function(){System.LaunchPackage("com.asicosilomu.ime", "Core", {"text": notes[i], "submitType": "save"}).then(function(t){notes[i]=t;this.innerText=notes[i];data.notes=notes;System.Storage.AppPrivate.Set("com.asicosilomu.notes", data);Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")})};
					}
					st(i);
					p.appendChild(e);
				}
				return p;
			}
			if (data.notes == undefined) data.notes = [];
			var c = document.createElement("div");
			var n = document.createElement("button");
			n.innerText = "New Note";
			n.style.padding = "10px";
			n.onclick = function(){data.notes.push("");System.Storage.AppPrivate.Set("com.asicosilomu.notes", data);Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")};
			c.appendChild(n);
			var da = document.createElement("button");
			da.innerText = "Clear All";
			da.onclick = function(){System.Storage.AppPrivate.Set("com.asicosilomu.notes", {});Activity.previous();System.LaunchPackage("com.asicosilomu.notes", "Core")};
			c.appendChild(da);
			var p = loadNotes(data.notes);
			c.appendChild(p);
			var a = Activity.create({"title": "Notes", "content": c});
			Activity.add(a);
		}
	},
	"com.asicosilomu.ime": {
		"frn": "Asicosilomu Keyboard",
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
						s.innerText = "space";
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
			var act = Activity.create({"title": "Keyboard", "content": c});
			Activity.add(act);
			prom.then(function(v){Activity.previous();ActivityResultPromise(v);});
		}
	},
	"com.asicosilomu.browser": {
		"frn": "Browser",
		"init": function () {
			var START_URL = "https://asicosilomu.github.io/asicosilomu/";
			var c = document.createElement("div");
			c.style.height = "100%";
			c.style.width = "100%";
			var addr = document.createElement("p");
			function st(a) { addr.innerText = a; ifr.src = a;addr.parentElement.parentElement.parentElement.querySelector(".actionbar").innerText = ifr.src + " - Browser"; };
			addr.onclick = function () { System.LaunchPackage("com.asicosilomu.ime", "Core", {"text": this.innerText, "submitType": "go"}).then(function(r){st(r);}); };
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
			rel.innerText = "Go";
			rel.onclick = function(){ifr.src=ifr.src;this.parentElement.parentElement.parentElement.querySelector(".actionbar").innerText = ifr.src + " - Browser";};
			c.appendChild(addr);
			c.appendChild(rel);
			c.appendChild(ifr);
			var act = Activity.create({"title": START_URL + " - Browser", "content": c});
			Activity.add(act);
		}
	},
	"com.asicosilomu.settings": {
		"frn": "Settings",
		"init": function () {
			var settings = [
				{
					"frn": "About",
					"init": function() { 
						var m = document.createElement("div");
						var properties = [
							{
								"name": "User-Agent",
								"value": window.navigator.userAgent
							},
							{
								"name": "System version",
								"value": `${System.ProductName} ${System.ProductVersion}`
							}
						];
						for (var i = 0; i < properties.length; i++) {
							var e = document.createElement("button");
							e.className = "listitem";
							e.innerHTML = `<span><b>${properties[i].name}: </b>${properties[i].value}</span>`;
							m.appendChild(e);
						}
						var a = Activity.create({"title": "About", "content": m});
						Activity.add(a);
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
			var a = Activity.create({"title": "Settings", "content": c});
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
	"com.asicosilomu.fullscreen.toggle": {
		"frn": "Fullscreen",
		"init": function () {
			function openFullscreen(elem){if(elem.requestFullscreen){elem.requestFullscreen()}else if(elem.webkitRequestFullscreen){elem.webkitRequestFullscreen()}else if(elem.msRequestFullscreen){elem.msRequestFullscreen()}};
			var a = Activity.create({"title": "Fullscreen Mode", "content": document.createElement("div")});
			Activity.add(a);
			openFullscreen(document.documentElement);
			setTimeout(Activity.previous, 250);
		}
	}
}

System.LaunchPackage = function(pkg, type, args) {
	var d = System.Packages[type];
	if (d) {
		var p = d[pkg];
		if (p) {
			if (!args) { args = {}; }
			var s;
			var r = new Promise(function(resolve){s=resolve;})
			args.ActivityResultPromise = s;
			p.init.apply(null, [args]);
			return r;
		} else { throw new Error("Failed to launch "+type+" package " + pkg + ". Not installed on device."); };
	} else { throw new Error("Invalid type."); };
};

// System UI

// Navigation Buttons
var navbutton_back = document.body.querySelector("#navbutton-back");
navbutton_back.onclick = function(){ Activity.previous(); };

var navbutton_home = document.body.querySelector("#navbutton-home");
navbutton_home.onclick = function() { Activity.jumpTo(0); };

// Start-up Sequence
System.LaunchPackage("com.asicosilomu.mobilehome", "Core");

});

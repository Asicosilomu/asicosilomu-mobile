// Asicosilomu Mobile by the all-mighty Asicosilomu!

window.System = {};
window.Activity = {};

// System Information
System.ProductName = "Asicosilomu Mobile";
System.ProductVersion = "1.0";

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

System.Packages = {};

// Core System Apps
System.Packages.Core = {
	"com.asicosilomu.mobilehome": {
		"frn": "Launcher",
		"init": function () {
			var c = document.createElement("div");
			c.style.paddingTop = "10px";
			var d = document.createElement("center");
			c.appendChild(d);
			var e = Object.entries(System.Packages.Core);
			for (var i = 0; i < e.length; i++) {
				if (e[i][0] != "com.asicosilomu.mobilehome") {
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
			d.innerText = "I'm the content!";
			var b = document.createElement("button");
			b.innerText = "Back";
			b.onclick = function () { Activity.previous(); };
			d.appendChild(b);
			var a = Activity.create({"title": "I'm an Activity!", "content": d});
			Activity.add(a);
		}
	}
}

System.LaunchPackage = function(pkg, type) {
	var d = System.Packages[type];
	if (d) {
		var p = d[pkg];
		if (p) {
			p.init();
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

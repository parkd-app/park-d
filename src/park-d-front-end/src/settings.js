var avoidToggles = [false, false, false];
var distanceUnits = 1;
function changePage(pageNum) {
  hideAll();
  if (pageNum == 0) {
    getDocEle("tab_highlight").style.top = "179px";
    getDocEle("tab_title").textContent = "General";
    getDocEle("general_content").style.display = "block";
  } else if (pageNum == 1) {
    getDocEle("tab_highlight").style.top = "233px";
    getDocEle("tab_title").textContent = "Navigation";
    getDocEle("navigation_content").style.display = "block";
  } else if (pageNum == 2) {
    getDocEle("tab_highlight").style.top = "285px";
    getDocEle("tab_title").textContent = "Account";
    getDocEle("account_content").style.display = "block";
  }
}

function changeDistanceUnits(num) {
  distanceUnits = num;
  if (num == 0) {
    getDocEle("distance_toggle_knob").style.left = "402px";
  } else {
    getDocEle("distance_toggle_knob").style.left = "536px";
  }
}

function toggleAvoid(num) {
  avoidToggles[num] = !avoidToggles[num];
  toggle = null;
  knob = null;
  if (num == 0) {
    toggle = getDocEle("tolls_toggle");
    knob = getDocEle("tolls_toggle_knob");
  } else if (num == 1) {
    toggle = getDocEle("ferries_toggle");
    knob = getDocEle("ferries_toggle_knob");
  } else {
    toggle = getDocEle("freeways_toggle");
    knob = getDocEle("freeways_toggle_knob");
  }
  toggle.style.background = avoidToggles[num]
    ? "rgba(215,219,0,1)"
    : "rgba(138,138,138,1)";
  knob.style.background = avoidToggles[num]
    ? "rgba(249,255,0,1)"
    : "rgba(217,217,217,1)";
  knob.style.left = avoidToggles[num] ? "35px" : "5px";
}

function logout() {}

function closeSettings() {}

function hideAll() {
  getDocEle("tab_title").textContent = "";
  getDocEle("general_content").style.display = "none";
  getDocEle("navigation_content").style.display = "none";
  getDocEle("account_content").style.display = "none";
}

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}

/*help*/
function ToggleDisplayHelp(e) {
  var element=document.getElementById(e);
  element.style.display=element.style.display==''?'block':'';
  element.onclick=function() { ToggleDisplayHelp(this.id); }
}
function InitHelp() {
  var a=document.getElementsByTagName('A');
  for(var i=0; i<a.length; i++) {
    var icon=a[i];
    if(icon.className.indexOf('helpicon')!=-1) {
      icon.setAttribute('title','Click to show/hide helptext');
      icon.onselectstart=function() { return false; };
      icon.onclick=function() { ToggleDisplayHelp(getName(this.href)); return false; };
    }
  }
}
if(window.attachEvent) window.attachEvent('onload',InitHelp);
else if(window.addEventListener) window.addEventListener('load',InitHelp,false);

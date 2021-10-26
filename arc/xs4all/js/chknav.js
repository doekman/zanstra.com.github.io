function $(id) { return document.getElementById(id); }
// http://www.quirksmode.org/viewport/compatibility.html
// http://www.quirksmode.org/js/findpos.html
function GetWindowHeight() {
  return window.innerHeight||document.documentElement&&document.documentElement.clientHeight||document.body.clientHeight||0;
}
function GetScrollTop() {
  return window.pageYOffset||document.documentElement&&document.documentElement.scrollTop || document.body.scrollTop||0;
}
function GetTop(element) {
  var pos=0;
  do pos+=element.offsetTop
  while(element=element.offsetParent);
  return pos;
}
function InView(element,margin) {
  if(typeof element=='string') element=$(element);
  if(!margin) margin=0;
  var Top=GetTop(element), ScrollTop=GetScrollTop();
  return !(Top<ScrollTop+margin || Top>ScrollTop+GetWindowHeight()-element.offsetHeight-margin);
}
function ScrollIntoView(element,bAlignTop,margin) {
  if(typeof element=='string') element=$(element);
  if(!margin) margin=0;
  var posY=GetTop(element);
  if(bAlignTop) posY-=margin;
  else posY+=element.offsetHeight+margin-GetWindowHeight();
  window.scrollTo(0, posY);
}
function RegEventHandler(element,name,handler) {
  if(element.addEventListener) element.addEventListener(name,handler,false);
  else if(element.attachEvent) element.attachEvent('on'+name,function() { handler(window.event); } );
  else {
    //komt dit tegenwoordig nog voor?
    var oldHandler=element['on'+name]?element['on'+name]:null;
    element['on'+name]=function() {
      if(oldHandler) oldHandler();
      handler(window.event);
    }
  }
}
var chknav={
  init:function(name,toggleHandler,keyHandler) {
    chknav.toggleHandler=function(chk) { if(toggleHandler) toggleHandler(chk); };
    chknav.keyHandler=function(chk,e) { if(keyHandler) keyHandler(chk,e); };
    chknav.elements=document.getElementsByName(name);
    chknav.insertPointers();
    for(var i=0; i<chknav.elements.length; i++) chknav.toggleHandler(chknav.elements[i]);
    chknav.current=0;
    chknav.last=null; //laatste via pointer getoggled
    chknav.lastChanged=null; //laatste via checkbox getoggled
    chknav.setVisible(true);
    RegEventHandler(document,'keypress',chknav.keyboardHandler);
  }
  ,
  select:function(x) {
    //--@x:type=null,boolean,function@true:select all, false: select none, null: toggle select, function: user-defined function, prototype: boolean onSelect(chk)
    for(var i=0; i<chknav.elements.length; i++) {
      var chk=chknav.elements[i];
      if(typeof x=='boolean') chk.checked=x;
      else if(x===null) chk.checked=!chk.checked;
      else if(typeof x=='function') chk.checked=x(chk);
      chknav.toggleHandler(chk);
    }
  }
  ,
  insertPointers:function() {
    for(var i=0; i<chknav.elements.length; i++) {
      var e=chknav.elements[i];
      //insert pointer
      var p=document.createElement("img");
      p.src="http://mail.google.com/mail/images/chevron.gif";
      p.className="pointer";
      p.alt="--";
      e.parentNode.insertBefore(p,e);
      //register handler
      RegEventHandler(e,'click',chknav.checkChanged);
    }
  }
  ,
  checkChanged:function(e) {
    var target=e.target||e.srcElement;
    if(e.shiftKey&&chknav.lastChanged!=null) {
      var b=null; //state-machine: null: nog niets gevonden, boolean: eerste is gevonden
      for(var i=0; i<chknav.elements.length; i++) {
        var chk=chknav.elements[i];
        if(b===null) {
          if(chk==target||chk==chknav.lastChanged) {
            chk.checked=b=target.checked;
            chknav.toggleHandler(chk);
          }
        }
        else {
          chk.checked=b;
          chknav.toggleHandler(chk);
          if(chk==target||chk==chknav.lastChanged) break; //at end
        }
      }
    }
    chknav.lastChanged=target;
    chknav.toggleHandler(target);
  }
  ,
  setVisible:function(b) {
    chknav.elements[chknav.current].previousSibling.style.visibility=b?"visible":'';
  }
  ,
  toggleChecked:function(i) {
    chknav.setChecked(i,!chknav.elements[i].checked);
  }
  ,
  setChecked:function(i,b) {
    var chk=chknav.elements[i];
    if(!chk.disabled&&chk.checked!=b) {
      chk.checked=b;
      chknav.toggleHandler(chk);
    }
  }
  ,
  move:function(dir) {
    if(chknav.current+dir<0||chknav.current+dir>=chknav.elements.length) return false;
    chknav.moveTo(chknav.current+dir, dir==-1);
    return true;
  }
  ,
  moveTo:function(pos,bAlignTop) {
    chknav.setVisible(false);
    chknav.current=pos;
    chknav.setVisible(true);
    var chk=chknav.elements[chknav.current];
    var marginUnit=chk.parentNode.offsetHeight*2;
    if(!InView(chk.parentNode,marginUnit)) {
       ScrollIntoView(chk.parentNode, bAlignTop, marginUnit);
     }
  }
  ,
  keyboardHandler: function(e) {
    var t=e.target||e.srcElement;
    if(t.tagName=='TEXTAREA'||(t.tagName=='INPUT'&&t.type=='text')) return;
    var chk=chknav.elements[chknav.current];
    switch(String.fromCharCode(e.charCode||e.keyCode)) { 
      case "X": //X (shift-X)
        if(chknav.last!=null) {
          var b=!chknav.elements[chknav.current].checked;
          for(var i=Math.min(chknav.current,chknav.last); i<=Math.max(chknav.current,chknav.last); i++) {
            chknav.setChecked(i,b);
          }
        }
        chknav.last=chknav.current;
        break;
      case "h": //h (begin)
        chknav.moveTo(0, true);
        break;
      case "j": //j (next)
        if(!chknav.move(1)) chknav.keyHandler(chk,e); //"bubble" on overflow
        break;
      case "k": //k (prev)
        if(!chknav.move(-1)) chknav.keyHandler(chk,e); //"bubble" on overflow
        break;
      case "l": //l (end)
        chknav.moveTo(chknav.elements.length-1, false);
        break;
      case "x": //x
        chknav.toggleChecked(chknav.current);
        chknav.last=chknav.current;
        break;
      case "a": //a (select all)
        chknav.select(true);
        break;
      case "A": //A (select none)
        chknav.select(false);
        break;
      case "t": //t (select toggle)
        chknav.select(null);
        break;
      default:
        chknav.keyHandler(chk,e);
        break;
    }
  }
};
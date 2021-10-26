// File: events.js

EventLib.prototype.addEventListener=EventLib_addEventListener;
EventLib.prototype.removeEventListener=EventLib_removeEventListener;
EventLib.prototype.$createLink=EventLib_$createLink;
EventLib.prototype.$createEvent=EventLib_$createEvent;
/*it looks like Mozilla thinks all events are bubble-able and cancelable*/
EventLib.prototype.$supportedEvents={
/*Mouse events types*/
  click:      {canBubble:true,  cancelable:true},
  mousedown:  {canBubble:true,  cancelable:true},
  mouseup:    {canBubble:true,  cancelable:true},
  mouseover:  {canBubble:true,  cancelable:true},
  mousemove:  {canBubble:true,  cancelable:false},
  mouseout:   {canBubble:true,  cancelable:true}, /*MSDN says: Cancels: no, what's the default action anyway*/
/*HTML event types*/
  load:       {canBubble:false, cancelable:false},
  unload:     {canBubble:false, cancelable:false},
  abort:      {canBubble:true,  cancelable:false}, /*MSDN says: false, true*/
  error:      {canBubble:true,  cancelable:false}, /*MSDN says: false, true*/
  select:     {canBubble:true,  cancelable:false}, /*MSDN says: false, true*/
  change:     {canBubble:true,  cancelable:false}, /*MSDN says: false, true*/
  submit:     {canBubble:true,  cancelable:true},  /*MSDN says: false, true*/
  reset:      {canBubble:true,  cancelable:false}, /*MSDN says: false, true*/
  focus:      {canBubble:false, cancelable:false}, 
  blur:       {canBubble:false, cancelable:false},
  resize:     {canBubble:true,  cancelable:false}, /*MSDN says: false, false*/
  scroll:     {canBubble:true,  cancelable:false}  /*MSDN says: false, false*/
}

function EventLib()
{
  //--| marker, to indicate the event-handler was touched by this library
  this.$touchMarker='/*eventLib*/'; 
}

//element: HTML element reference (object), of id of element (string)
//type: name of the event (string)
//fn: function reference (function), or name of the function (string)
function EventLib_addEventListener(element,type,listener)
{ 
  //--| if element is a string, get ID
  if(typeof element=='string') element=ID(element);
  //--| check if element is an HTML element of window-object.
  if(!element||(!element.tagName&&!element.alert)) 
    return error('events can only be attached to Element Nodes (tags)');
  //--| if function-reference is passed, convert it to string
  if(typeof listener!='function') 
    return error('you\'ve got to pass a function-reference as 3rd argument');
  //--| attach event (concat)
  if(element[type]==null)
  {
    //first event
    element[type]=new Function('e',
      this.$touchMarker+'\n'+
      'var _event=eventLib.$createEvent(this,e);\n'+
      this.$createLink(listener)+
      'return _event.returnValue;'
    );
  }
  else
  {
    //There is already an event handler
    //check if the handler has been touched by this lib
    var eventCode=element[type].innerFunction();
    if(eventCode.indexOf(this.$touchMarker)==0)
    {
      //add function just before "return bReturnValue"
      var i=eventCode.lastIndexOf('return _event.returnValue;');
      element[type]=new Function('e',
        eventCode.substring(0,i)+
        this.$createLink(listener)+
        'return _event.returnValue;'
      );
    }
    else
    {
      //convert code declared in HTML
      element[type]=new Function('e',
        this.$touchMarker+'\n'+
        'var inlineCode=function(){'+eventCode+'}\n'+
        'var _event=eventLib.$createEvent(this,e);\n'+
        this.$createLink('inlineCode')+
        this.$createLink(listener)+
        'return _event.returnValue;'
      );
    }
    delete eventCode;
  }
  delete fn;
  return true;
}

function EventLib_removeEventListener(element,type,listener)
{
  //--| if element is a string, get ID
  if(typeof element=='string') element=ID(element);
  //--| if function-reference is passed, convert it to string
  if(typeof listener!='function') 
    return error('you\'ve got to pass a function-reference as 3rd argument');
  //--| convert funcion-reference to a function-call string   
  var fn=listener.getName()+'();';
  //--| check if it can be removed
  if(!element||!element[type])
    return error('element does not exist, or has no listeners attached.');
  //--| remove event
  //get inner function
  var s=element[type].innerFunction();
  //make line, to look for
  var t=this.$createLink(listener);
  //check if listener was ever attached
  var i=s.indexOf(t);
  if(i<0) 
    return error('listener was never attached.');
  //remove line (Opera problems??)
  s=s.replace(t,'');
  if(s.indexOf('_event.returnValue=false;\n')<0)
    element[type]=null; //no events left
  else
    element[type]=new Function(s);
  return true;
}

//Creates a event-link for the event-chain 
//example: 'if(checkForm.call(this,_event)==false) returnValue=false;\n'
function EventLib_$createLink(listener)
{
  var functionName;
  if(typeof listener=='function') 
    functionName=listener.getName();
  else /*it's a string*/
    functionName=listener;
  return 'if('+functionName+'.call(this,_event)==false) _event.returnValue=false;\n';
}

//--| Creates the appropriate event-object
function EventLib_$createEvent(THIS,e)
{
  var type=e?e.type:window.event.type;
  var options=this.$supportedEvents[type];
  if(!options) return error('Unsupported event.');
  var _event=new Event(THIS,e);
  _event.initEvent(type,options.canBubble,options.cancelable);
  return _event;
}

//--| Create a global variable for direct use of the library
//--| DON'T change the name of the variable, for .addEventListener
//--| is using it as well.
var eventLib=new EventLib();

/***| Event Objects |******************************************************************************/
/*constants*/
Event.prototype.CAPTURING_PHASE   =1;
Event.prototype.AT_TARGET         =2;
Event.prototype.BUBBLING_PHASE    =3;
/*methods*/
Event.prototype.stopPropagation=Event_stopPropagation;
Event.prototype.preventDefault=Event_preventDefault;
Event.prototype.initEvent=Event_initEvent;

function Event(THIS,e)
{
  /*readonly attributes*/
  if(e)
  {
    //--| Mozilla/w3c
    this.$event=e;
    this.target=e.target;/*PROBLEM? Can be a text-node*/
    this.currentTarget=e.currentTarget;
    this.eventPhase=e.eventPhase;/*PROBLEM? when text-node is target, inconsistent bubbling-phase*/
    this.timeStamp=e.timeStamp;
  }
  else if(window.event)
  {
    //--| IE
    this.target=window.event.srcElement;
    this.currentTarget=THIS;
    this.eventPhase=THIS==window.event.srcElement?this.AT_TARGET:this.BUBBLING_PHASE;
    this.timeStamp=0;
  }
}
function Event_stopPropagation()
{
  if(this.$event) this.$event.stopPropagation();
  else window.event.cancelBubble=true;
}

function Event_preventDefault()
{
  //--| Do this always the "old fashioned way", should work on all browsers
  this.returnValue=false;
}

function Event_initEvent(eventTypeArg,canBubbleArg,cancelableArg)
{
  this.type=eventTypeArg;
  this.bubbles=canBubbleArg;
  this.cancelable=cancelableArg;
}

/***| Helper Functions |***************************************************************************/

//--| do some error-handling
function error(s)
{
  alert(error.caller.getName()+':\n'+s);
  return false;
}

//--| Get the name of a function
//--| With an anonymous function, an empty string is returned.
//--| When no proper function-reference is supplied, null is returned.
Function.prototype.getName=function Function_getName()
{
  var re=/function\s*([a-zA-Z$_]{0,1}[a-zA-Z0-9$_]*)\(/;
  var a=this.toString().match(re);
  if(a&&typeof a[1]=='string') return a[1];
  return null;
}
//--| Get body of a function (the stuff between surrounding curly braces)
Function.prototype.innerFunction=function Function_innerFunction()
{
  var s=this.toString();
  return (s.substring(s.indexOf('{')+1,s.lastIndexOf('}'))).trim();
}

//--| Compatability: .call is only introduced on IE5.5/Win,
//--| and absent on IE/Mac, this is for compatibility
if(!Function.call) Function.prototype.call = function(THIS,arg0)
{
  if(!THIS||typeof THIS!='object') { return error('First argument needs to be an object.'); }
  THIS.$call=this;
  return THIS.$call(arg0);
}

//--| Remove leading and trailing white-space
//Opera doesn't the | in regular expressions, so do two replaces
//Normal: /^\s*|\s*$/g
String.prototype.trim=function String_trim()
{ 
  return this.replace(/^\s*/,'').replace(/\s*$/,'');
}

//--| object to string (sep optional
function o2s(o,sep)
{
  var s='';
  if(typeof o!='object') return '[o2s:Not an object]';
  if(!sep) sep='\n';
  for(var i in o) s+=i+':'+o[i]+sep;
  return s;
}

//--| Get a reference to an element by supplying the id-attribute
function ID(s)
{
  if(document.getElementById) return document.getElementById(s);
  else if(document.all) return document.all[s];
  else return null;
}
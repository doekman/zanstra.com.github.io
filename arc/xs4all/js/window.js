/*
 * A wizard to create window.open javascript code.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/windowOpen.htm for more info.
 */

var sBaseURL='http://www.xs4all.nl/~zanstra/';
var urlAlert=sBaseURL+'img/iconAlert.png';
var urlConfirm=sBaseURL+'img/iconQuestion.png';
var urlPrompt=sBaseURL+'img/iconQuestion.png';

var aPreload=[new Image(),new Image()]; aPreload[0].src=urlAlert; aPreload[1].src=urlPrompt;

function htmlAlert(sMelding,left,top,width,height) {
  var sFeatures;
  if(window.showModalDialog==null) {
    sMelding=sMelding.replace(/<br>/ig,'\n').replace(/<[^>]+\>/g,''); //translate <br> to \n and then strip html tags
    window.alert(sMelding);
  }
  else {
    if(width==null) width=300;
    if(height==null) height=150;
    if(left==null) left=screen.width/3-width/2;
    if(top==null) top=screen.height/3-height/2;
    sFeatures
      ='dialogLeft:'+left+'px;'
      +'dialogTop:'+top+'px;'
      +'dialogWidth:'+width+'px;'
      +'dialogHeight:'+height+'px;'
      +'help:no;'
      +'resizable:yes;'
      +'scroll:no;'
      +'status:no;';
    window.showModalDialog(sBaseURL+'js/alert.htm',[urlAlert,sMelding],sFeatures);
  }
}

function htmlConfirm(sMelding,sOK,sCancel,left,top,width,height) {
  var sFeatures;
  if(window.showModalDialog==null) {
    sMelding=sMelding.replace(/<br>/ig,'\n').replace(/<[^>]+\>/g,''); //translate <br> to \n and then strip html tags
    return window.confirm(sMelding);
  }
  else {
    if(sMelding==null) sMelding='';
    if(sOK==null) sOK='OK';
    if(sCancel==null) sCancel='Annuleer';
    if(width==null) width=300;
    if(height==null) height=150;
    if(left==null) left=screen.width/3-width/2;
    if(top==null) top=screen.height/3-height/2;
    sFeatures
      ='dialogLeft:'+left+'px;'
      +'dialogTop:'+top+'px;'
      +'dialogWidth:'+width+'px;'
      +'dialogHeight:'+height+'px;'
      +'help:no;'
      +'resizable:yes;'
      +'scroll:no;'
      +'status:no;';
    return window.showModalDialog(sBaseURL+'js/confirm.htm',[urlConfirm,sMelding,sOK,sCancel],sFeatures);
  }
}

function htmlPrompt(sMelding,sDefault,left,top,width,height) {
  var sFeatures;
  if(sDefault==null) sDefault='';
  if(window.showModalDialog==null) {
    sMelding=sMelding.replace(/<br>/ig,'\n').replace(/<[^>]+\>/g,''); //translate <br> to \n and then strip html tags
    return window.prompt(sMelding,sDefault);
  }
  else {
    if(width==null) width=300;
    if(height==null) height=150;
    if(left==null) left=screen.width/3-width/2;
    if(top==null) top=screen.height/3-height/2;
    sFeatures
      ='dialogLeft:'+left+'px;'
      +'dialogTop:'+top+'px;'
      +'dialogWidth:'+width+'px;'
      +'dialogHeight:'+height+'px;'
      +'help:no;'
      +'resizable:yes;'
      +'scroll:no;'
      +'status:no;';
    var ret=window.showModalDialog(sBaseURL+'js/prompt.htm',[urlPrompt,sMelding,sDefault],sFeatures);
    if(ret==null) return;
//    else if(/^[0-9]+$/.test(ret)) return parseInt(ret,10); //according to MS documentation, prompt can return a Number, well, it doesn't
    else return ret;
  }
}
/*
 * A javascript implementation of an UBB parser.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/ubbParser.htm for more info.
 */

/*
Grammar for UBB-parser:
  text = *(char|ubbMarkup)
  char = <any text, not interfering with ubbMarkup>
  ubbMarkup = ubbOpenTag text ubbCloseTag
  ubbOpenTab = "[" tagName ["=" parameter] "]"
  tagName = 1*("a".."z"|"A".."Z")
  parameter = <everything, but "]">
  ubbCloseTag = "[/" tagName "]"
Additional rules:
-Tags must be nested properly. The following is wrong:
  [b]bla [i]die [/b] bla[/i]
 and will be processed to
  [b]bla <i>die [/b] bla</i>
 The following might 
  [b]bla [em]die[/em[/b] [em]bla[/em]
*/

function StackEntry(sTag) {
//StackEntry-object constructor
/*members*/
  this.tag=sTag;
  this.param='';
  this.text='';
  this.complete=false; //tag is finalized
  return this;
}

function Parser(dbg) {
//Parser-object constructor
/*members*/
  this.aStack=[new StackEntry('')];
  this.dbg=dbg==null?false:dbg;
/*methods*/
  this.ubbParse=Parser_ubbParse;
  this.collapseStackAsUBB=Parser_collapseStackAsUBB;
  this.collapseStackAsText=Parser_collapseStackAsText;
/*supported tags. Property name is tagname (all lowercase) and 
  property value indicates if parameters are supported*/
  this.oTags={
    b:false, i:false, u:false, s:false, sub:false, sup:false,
    url:true, email:false, img:true, image:true,
    me:true,
    quote:false, code:true
  }
  return this;
}

function Parser_collapseStackAsText() {
  if(this.aStack.length>=2) {
    var oSE=this.aStack[this.aStack.length-1]; //Stack Entry
    this.aStack[this.aStack.length-2].text += '['+oSE.tag+(oSE.param.length==0?'':'='+oSE.param)+(oSE.complete?']':'')+oSE.text;
    delete this.aStack[this.aStack.length-1];
    this.aStack.length--;
  }
}

function Parser_collapseStackAsUBB() {
  if(this.aStack.length>=2) {
    var oSE=this.aStack[this.aStack.length-1]; //Stack Entry
    var s, sCurrentTag=oSE.tag.toLowerCase();
    switch(sCurrentTag) {
      //tags are also defined in associative-array oTags
      case 'b': case 'i': case 'u': case 's': case 'sub': case 'sup':
        s='<'+sCurrentTag+'>'+oSE.text+'</'+sCurrentTag+'>';
        break;
      case 'url':
        var sURL=oSE.param.length>0?oSE.param:oSE.text;
        if(sURL.indexOf('http://')!=0&&sURL.indexOf('ftp://')!=0) sURL='http://'+sURL;
        s='<a href="'+sURL+'">'+oSE.text+'</a>';
        break;
      case 'email':
        s='<a href="mailto:'+oSE.text+'">'+oSE.text+'</a>';
        break;
      case 'image': case 'img':
        if(oSE.text.indexOf('http://')!=0) oSE.text='http://'+oSE.text;
        if(oSE.param.length>0&&oSE.param.indexOf(',')==oSE.param.lastIndexOf(',')) {
          var arr=oSE.param.split(',')
          s='<img src="'+oSE.text+'" width="'+arr[0]+'" height="'+arr[1]+'" />';
        }
        else {
          s='<img src="'+oSE.text+'" />';
        }
        break;
      case 'me':
        s='<span class="me">* '+oSE.param+' '+oSE.text+'</span>';
        break;
      case 'quote':
        s='<blockquote class="quote">Quote:<hr class="quote" /><div class="quote">'+oSE.text+'</quote><hr class="quote" /></blockquote>';
        break;
      case 'code':
        //Can't rely on &nbsp; and overflow: visible, because a dash (-) is also a word-wrap character, and I can't find a non-breaking-dash
        s='<blockquote class="code">Code:<hr class="code" /><pre class="code">'+oSE.text+'</pre><hr class="code" /></blockquote>';
        break;
    }
    //remove top stack entry
    delete this.aStack[this.aStack.length-1];
    this.aStack.length--;
    //copy text
    this.aStack[this.aStack.length-1].text += s;
  }
}

function Parser_ubbParse(s) {
  var aState=['inTag','startTag','endTag','param','text'];
  var nState, eInTag=0, eStartTag=1, eEndTag=2, eParam=3, eText=4; /*for state machine*/
  var i=0, j, ch, sEndTag;

  nState=eText;
  while(1) {
    ch=s.substr(i++,1);

if(this.dbg&&!confirm('ch='+ch+'\nnState='+nState+' ('+aState[nState]+')\nthis.aStack.length='+this.aStack.length+'\ni='+i+'\ns.length='+s.length+'\nstack.tag='+this.aStack[this.aStack.length-1].tag+'\nstack.param='+this.aStack[this.aStack.length-1].param+'\nstack.text='+this.aStack[this.aStack.length-1].text+'\nsEndTag='+sEndTag)) return;

    switch(nState) {
/***/ case eText: /*---------------------------------------------------------*/
        if(ch=='[') {
          nState=eStartTag;
          j=i; //remember rollback point, if it's no tag.
        }
        else {
          if(s.substr(i-1,2)=='\r\n') {
            //new line
            i++;
            this.aStack[this.aStack.length-1].text+='<br />';
          }
          else if(ch=='\r'||ch=='\n') {
            //new line for mac/unix (and firefox)
            this.aStack[this.aStack.length-1].text+='<br />';
          }
          else {
            //normal text
            this.aStack[this.aStack.length-1].text+=ch; 
          }
        }
        break;
/***/ case eStartTag: /*------------------------------------------------------*/
        if(ch=='/') {
          nState=eEndTag;
          sEndTag='';
        }
        else if(ch>='a'&&ch<='z'||ch>='A'&&ch<='Z') {
          nState=eInTag;
          this.aStack[this.aStack.length]=new StackEntry(ch.toLowerCase());
        }
        else {
          //Not valid tag-name, treat as text
          nState=eText;
          //rollback
          i=j;
          this.aStack[this.aStack.length-1].text+='['; 
        }
        break;
/***/ case eInTag: /*---------------------------------------------------------*/
        if(ch=='=') {
          var x=this.oTags[this.aStack[this.aStack.length-1].tag];
          if(x==null||x==false) {
            //not defined tag or no parameters allowed, so rollback
            nState=eText;
            delete this.aStack[this.aStack.length-1];
            this.aStack.length--;
            i=j;
            this.aStack[this.aStack.length-1].text+='['; 
          }
          else {
            //allowed parameter
            nState=eParam;
          }
        }
        else if(ch==']') {
          nState=eText;
          if(this.oTags[this.aStack[this.aStack.length-1].tag]==null) {
            //not defined tag, so rollback
            delete this.aStack[this.aStack.length-1];
            this.aStack.length--;
            i=j;
            this.aStack[this.aStack.length-1].text+='['; 
          }
          else if(this.aStack[this.aStack.length-1].tag==this.aStack[this.aStack.length-2].tag) {
            //this opening tag was the same as previous opening tag, 
            //treat as closing tag (assume / forgotten)
            //so, forget this tag
            delete this.aStack[this.aStack.length-1];
            this.aStack.length--;
            //collapse previous tag
            this.collapseStackAsUBB();
          }
          else {
            this.aStack[this.aStack.length-1].complete=true;
          }
        }
        else if(ch>='a'&&ch<='z'||ch>='A'&&ch<='Z') {
          this.aStack[this.aStack.length-1].tag+=ch.toLowerCase();
        }
        else {
          //Not valid tag-name, treat as text
          nState=eText;
          //rollback
          delete this.aStack[this.aStack.length-1];
          this.aStack.length--;
          i=j;
          this.aStack[this.aStack.length-1].text+='['; 
        }
        break;
/***/ case eParam: /*---------------------------------------------------------*/
        if(ch==']') { 
          nState=eText;
          this.aStack[this.aStack.length-1].complete=true;
        }
        else {
          //accept every char but "]" as parameter
          this.aStack[this.aStack.length-1].param+=ch;
        }
        break;
/***/ case eEndTag: /*---------------------------------------------------------*/
        if(ch==']') {
          nState=eText;
          //process stack
          if(sEndTag==this.aStack[this.aStack.length-1].tag) {
            //matching opening and closing tags
            this.collapseStackAsUBB();
          }
          else {
            //Non-mathing tag-name, treat as text
            nState=eText;
            //rollback
            i=j;
            this.aStack[this.aStack.length-1].text+='['; 
          }
        }
        else {
          sEndTag+=ch.toLowerCase();
        }
        break;
/***/ default: /*---------------------------------------------------------*/
        //error
        break;
    } /*end switch*/
    if(i>=s.length) {
      //End Of String
      break; 
    }
  } /*end while*/
  //collapse stack (if any)
  if(this.aStack.length>1) {
    if(nState==eEndTag) {
      //Handle unprocessed text from endTag
      this.aStack[this.aStack.length-1].text+='[/'+sEndTag;
    }
    //collapse stack entries
    for(var k=this.aStack.length-1; k>0; k--) {
      this.collapseStackAsText();
    }
  }
  return '<div class="msg">'+this.aStack[0].text+'</div>';
 }

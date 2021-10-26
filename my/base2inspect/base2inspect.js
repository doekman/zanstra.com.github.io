// timestamp: Sun, 20 May 2007 21:46:48

new function(_) { ////////////////////  BEGIN: CLOSURE  ////////////////////

// =========================================================================
// DOC/namespace.js
// =========================================================================

var DOC = new base2.Namespace(this, {
	name:    "DOC",
	version: "0.2",
	exports: "Node,ColumnControl,getNamespaceNodes"
});
eval(this.imports);

// =========================================================================
// DOC/Node.js
// =========================================================================
//Lazy evaluated tree
var Node=Base.extend({
  constructor: function(fqn,text,getChildren) {
    this.fqn=fqn; //fully qualified name, necessary
    this.text=text;
    this._getChildren=getChildren; //function, returning array of Node's
    Node.setNode(this);
  },
  hasChildren: function() {
    return typeof this._getChildren=='function';
  },
  getChildren: function() {
    if(this._getChildren==null) return null;
    if(!this.childNodes) this.childNodes=this._getChildren(this);
    return this.childNodes;
  },
  toString: function() {
    return this.text+" ("+this.fqn+")";
  }
},{ //--| static members |-----------------------------------------------------
  contextHash: {}, //hash of keys in format: context:fqn
  getContextKey: function(fqn) {
    var ctx=Node.contextOverride||"none";
    return ctx+":"+fqn;
  },
  setNode: function(node) {
    Node.contextHash[Node.getContextKey(node.fqn)]=node;
  },
  getNode: function(fqn) {
    return Node.contextHash[Node.getContextKey(fqn)];
  },
  //more somewhere else
  sort: function(a,b) { 
    var A=a.text, B=b.text;
    return A<B?-1:A>B?1:0;
  }
});
// =========================================================================
// DOC/ColumnControl.js
// =========================================================================
var ColumnControl=Base.extend({
  constructor: function(columnCount,rows,rootNode,container) {
    this.columnCount=columnCount;
    this.rows=rows;
    this.rootNode=rootNode;
    //this.onSelect=onSelect||K;
    this.container=container;
    //
    this.container.innerHTML='<div class="path"><span>Path:</span> <code></code> (<span></span>)</div><div></div>';
    this.columnBrowser=this.container.firstChild.nextSibling;
    this.pathHolder=this.container.firstChild.childNodes[2];
    this.pathRemarks=this.container.firstChild.childNodes[4];
    
    this.display();
    //Fill first level
    var select=this.columnBrowser.firstChild;
    ColumnControl.fillSelect(select,rootNode.getChildren());
    //select base2 namespace
    for(var i=0; i<select.options.length; i++) {
      var option=select.options[i];
      if(option.value=="base2") {
        option.selected=true;
        break;
      }
    }
    select.onchange();
  },
  display: function() {
    var pathHolder=this.pathHolder;
    var pathRemarks=this.pathRemarks;
    var width=Math.floor(1/this.columnCount*100-1)+"%";
    for(var i=0; i<this.columnCount; i++ ) {
      var select=document.createElement("select");
      select.size=this.rows;
      select.style.minWidth=width;
      //--| onchange
      select.onchange=function(e) {
        var option=this.options[this.selectedIndex];
        var text, remarks, fqn=option.value, node=Node.getNode(fqn), partial=fqn.indexOf("..")>=0;
        if(partial) {
          text=fqn.replace(/\.\.$/,"&hellip;");
          remarks="<em>please select a method</em>";
        }
        else {
          var obj=fqn2o(fqn);
          remarks=obj.kind
          if(option.text.indexOf("(i)")>0) remarks+=', inherited';
        }
        pathHolder.innerHTML=fqn;
        pathRemarks.innerHTML=remarks;
        if(node.hasChildren()) {
          ColumnControl.fillSelect(this.nextSibling,node.getChildren());
        }
        else {
          console.info("no children");
          ColumnControl.clearSelects(this.nextSibling)
        }
      };
      //--| onkeydown (TODO: canceling in Firefox/Safari doesn't work?)
      select.onkeydown=function(e) {
        var option=this.options[this.selectedIndex];
        var node=Node.getNode(option.value);
        if((e.keyCode==37||e.keyCode==39)) {
          if(e.keyCode==39&&this.nextSibling&&node.hasChildren()) {
            //right
            this.nextSibling.focus();
          }
          else if(e.keyCode==37&&this.previousSibling) {
            //right
            this.previousSibling.focus();
          }
          return false;
        }
      };
      this.columnBrowser.appendChild(select);
    }
  }
},{ //--| Static members
  clearSelects: function(select) {
    //clear selects at the right
    while(select) {
      select.options.length=0;
      select=select.nextSibling;
    }
  },
  fillSelect: function(select,nodes) {
    if(select==null) {
      alert("Oops, out of columns.");
      return;
    }
    var options=select.options;
    options.length=0; //clear select
    forEach(nodes, function(node) {
      var option=new Option(node.text, node.fqn);
      option.className=node.hasChildren()?"branch":"leaf";
      options[options.length]=option;
    });
    ColumnControl.clearSelects(select.nextSibling);
  }
});
// =========================================================================
// DOC/base2inspect.js
// =========================================================================
/*
var Reflection=Base.extend({
},{ //static
  GetNamespaces: function(excludeBase2) {
    var ns=Enumerable.filter(base2, function(item){
      return instanceOf(item,Namespace)&&(excludeBase2?item!=base2:true);
    });
    return Enumerable.map(ns,function(item){return item.name;}).sort();
  },
  GetExports: function(parent) {
    var exports=instanceOf(parent,Namespace)?parent.exports.split(","):[];
    if(instanceOf(parent,Namespace)&&parent.name=='base2') {
      //exception: base2 "includes" namespace base2.lang
      exports=exports.concat(base2.lang.exports.split(","));
    }
    return exports.sort();
  }
});
var ns=Reflection.GetNamespaces(true);
var ex=Reflection.GetExports(base2);
//alert( ns.concat('----',ex).join("\n") );

function GetKind(item) {
  //TODO: kijken of iets overerft is
  if(typeof item=="object") {
    if(instanceOf(item,Namespace)) return "N";
    if(instanceOf(item,Array)) return "A";
    return "O"; //object
  }
  else if(typeof item=="function") {
    return IsClass(item)?"C":"f";
  }
  else {
    return "a"; //attribute
  }
}
*/

function AnnotateClasses() {
  var i=0, j=0;
  forEach(base2,function(ns,key){
    if(instanceOf(ns,Namespace)) {
      i++;
      forEach(ns.exports.split(","),function(item) {
        var klass=ns[item];
        if (isClass(klass)&&klass.className===undefined) { 
          klass.className=item;
          j++;
        }
      });      
    }
  });
  console.log(j+" classes annotated within "+i+" namespaces.");
}
window.addEventListener('load',AnnotateClasses,false);

//--| Test stuff |-------------------------------------------------------------
function isClass(member) { 
  return (typeof member=="function" && member.prototype instanceof Base)
      || (member===Base); 
}
function isFunction(member) {
  return typeof member=="function"
      && !isClass(member);
}
function isOkMethod(method,methodName) {
  return typeof method=="function"&&!/^ancestor|base|constructor$/.test(methodName);
}
function isInstanceMemberInherited(cls,memberName) {
  return cls.prototype[memberName]===cls.ancestor.prototype[memberName];
}
function isStaticMemberInherited(cls,memberName) {
  return cls[memberName]===cls.ancestor[memberName];
}
//--| Get stuff |--------------------------------------------------------------
function getNamespaces() {
  return Enumerable.filter(base2, function(item){
    return instanceOf(item,Namespace);
  });
}
//Geeft een array van strings terug (ns==array of namespaces)
function getNamespacesItemNames(test,ns) {
  var res=[];
  forEach(getNamespaces(), function(ns) {
    res=res.concat(getNamespaceItems(test,ns));
  });
  return res;
}
//Geeft een array van strings terug
function getNamespaceItemNames(test,ns) {
  return Enumerable.filter(ns.exports.split(","), function(xport) {
    return test(ns[xport],xport,ns);
  });
}

function getClassItemNames(test,cls) {
  var res=new Array2;
  for(var memberName in cls) {
    if(test(cls[memberName], memberName)) res.push(memberName);
  }
  return res;
}
//--| Convert stuff |----------------------------------------------------------
function fqn() { 
  return Enumerable.map(arguments,K).join(".");
  //var a=[];for(var i=0; i<argument.length; i++) a.push(arguments[i]); return a.join(".")
}
function getTypeName(o) {
  
}
function fqn2o(fqn) {
  //if(fqn.indexOf("..")>=0) return null; //not a full path
  var o=base2, p=base2, res={};
  forEach(fqn.split("."), function(part,i) {
    if(part!="") {
      if(o[part]===undefined) throw new Error(format("%1 in %2 is undefined.",part,fqn));
      o=o[part];
      if(i==0) { res.kind="namespace"; }
      if(i==1) { res.name=part; res.kind=isClass(o)?"class":"function"; }
      if(i==2) { res.kind="static method";  }
      if(i==3) { res.kind="instance method"; }
      p=o;
    }
    else {
      res.kind="partial";
    }
  });
  res.o=o;
  return res;
}
function getNamespaceNodes() {
  return getNamespaces().map(function(ns) { 
    return new Node(ns.name,ns.name,function() { return getClassAndFunctionNodes(ns); }) 
  }).sort(Node.sort);
}
function getClassAndFunctionNodes(ns) {
  // classes
  var a=getNamespaceItemNames(isClass,ns).map(function(memberName) {
    return new Node(fqn(ns.name,memberName),memberName,function() {
      return getMethodNodes(ns,memberName);
    })
  }).sort(Node.sort);
  // functions
  var b=getNamespaceItemNames(isFunction,ns).map(function(memberName) {
    return new Node(fqn(ns.name,memberName), memberName);
  }).sort(Node.sort);
  //group after sort
  return a.concat(b);
}
function getMethodNodes(ns,className) {
  var cls=ns[className];
  var prefix=ns.name+"."+className+".";
  var staticMethodGroupNode=[new Node(prefix+".", "static methods", function() {
      return getStaticMethodNodes(ns,className);
  })];
  prefix+="prototype.";
  var instanceMethodNodes=getClassItemNames(isOkMethod,cls.prototype).map(function(methodName) {
    var text=isInstanceMemberInherited(cls,methodName)?methodName+" (i)":methodName;
    return new Node(prefix+methodName, text);
  });
  return staticMethodGroupNode.concat(instanceMethodNodes.sort(Node.sort));
}
function getStaticMethodNodes(ns,className) {
  var cls=ns[className];
  var prefix=ns.name+"."+className+".";
  return getClassItemNames(isOkMethod,cls).map(function(methodName) {
    var text=isStaticMemberInherited(cls,methodName)?methodName+" (i)":methodName;
    return new Node(prefix+methodName, text);
  }).sort(Node.sort);
}
/*
// old stuff
function GetChildItems(parent) {
  var res=[];
  //static
  forEach(parent.item, function(item,key) {
    var fqn=parent.fqn+"."+key;
    var fn=IsClass(item)||instanceOf(item,Namespace)?GetChildItems:null;
    res.push(new Node(fqn,item,fn));
  });
  //instance
  for(var key in parent.item.prototype) {
    var item=parent.item.prototype[key];
//  forEach(parent.item.prototype, function(item,key) {
    var fqn=parent.fqn+"."+key;
    var fn=IsClass(item)||instanceOf(item,Namespace)?GetChildItems:null;
    res.push(new Node(fqn,item,fn));
  }//);
  return res.sort(Node.sort);
}

*/
eval(this.exports);

}; ////////////////////  END: CLOSURE  /////////////////////////////////////

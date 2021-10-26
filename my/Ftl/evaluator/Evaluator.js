/*** Evaluator class **/
/*
   Synopsis:
		var e=new Evaluator();
		 e.addNode('a',['b','d']);
		 e.addNode('b',['d']);
		 e.addNode('c',['b']);
		 e.addNode('d',[]);
     e.prepare(); // a master dependancy graph is built.

     e.addCalcEventListener(function(nodeName){});  // listeners that need to trigger/perform the actual calculation.

     e.calc(); // calcs all , based on the masterGraph.
     e.calc(['c']) // calcs only the nodes based on the fact that c is dirty.

   Asynchronous use:
     .. 
     e.addCalcEventListener(
      function(nodeName,callback)
      {
         ... perform some long calculation here....
         callback();
      }
     );

     e.calc(null,true); // calcs all asynchrounously based on the masterGraph.
     e.calc(['c'],true) // calcs only the nodes based on the fact that c is dirty.

*/

function Evaluator()
{
  this.masterDependancyGraph=new Object(); // contains GraphItem objects, which contains nodes.
  this.calcGraph=null ; // this is the graph that is used when calcing.
  this.arrListeners=new Array();
  this.busy=false ;// busy flag to check if not 2 calculations are running at the same time.
}

Evaluator.prototype.addNode=function(nodeName,depList)
{
//--@nodeName,string a unique string representing a node that can be calculated.
//--@depList, array of strings. nodenames that are dependant on this node.
  if (this.masterDependancyGraph[nodeName])
  {
    throw new Error("dependancies for "+nodeName+" were already specified.");
  }
  var o=new GraphItem(nodeName,depList);
  this.masterDependancyGraph[nodeName]=o;
}

Evaluator.prototype.prepare=function()
{
  // completes the master Dependancy Graph. This is done by filling the inDegree properties of the GraphItems.
  // for each node in the depList of a graphItem, the graphItem of that node is updated with an inDegree+1.
  for (var v in this.masterDependancyGraph )
  {
    var lst=this.masterDependancyGraph[v].depList;
    for (var i=0;i<lst.length ;i++ )
    {
      var item=lst[i];
      if (this.masterDependancyGraph[item])
      {
        this.masterDependancyGraph[item].inDegree++ ;  
      }
    }
  }
}
Evaluator.prototype.toString=function() 
{
  // converts the graph to a string.
  var lst=[];
  for(var v in this.masterDependancyGraph) {
    lst.push(this.masterDependancyGraph[v].toString());
  }
  return lst.join("\n");
}
Evaluator.prototype.calc=function(arrDirtyNodes,blnAsync)
{
  // does a calculation. 
  // arrDirtyNodes is an array of strings (nodeNames) which are dirty.
  // if arrDirtyNodes == null, then everything is recalced.
  if (this.busy)
  {
    throw new Error("calculation is already started, cannot be started twice at the same time.");
     
  }

  this.calcGraph = arrDirtyNodes==null 
    ? this.masterDependancyGraph
    : this.getDependancySubGraph(arrDirtyNodes);
  this.doCalc(blnAsync);
}

Evaluator.prototype.getDependancySubGraph=function(arrDirtyNodes)
{
  var depGraph=new Object();
  var arrStack=new Array();
  for (var i=0;i<arrDirtyNodes.length ;i++ )
  {
    arrStack.push({ left: null, right: arrDirtyNodes[i] });
    while (arrStack.length>0)
    {
      var obj=arrStack.pop();
      // add node to depGraph if it wasnt vistied yet, and add its chidren to the stack
      if (!this.masterDependancyGraph[obj.right].visited)
      {
        var item=new GraphItem(obj.right);
        depGraph[obj.right]=item;
        // add childrento stack.
        for (var j=0; j<this.masterDependancyGraph[obj.right].depList.length;j++)
        {
          var dep=this.masterDependancyGraph[obj.right].depList[j];
          arrStack.push({left: item.nodeName, right: dep});
        }
      }
      // if there is a left node, then a dependancy relation must be made.
      // this can be done by adding the dependancy to the left and increasing the inDegree of the right.
      if (obj.left !=null)
      {
        depGraph[obj.left].depList.push(obj.right);
        depGraph[obj.right].inDegree++;
      }

    }
  }
  // clear visited flags in masterGraph.
  for(var v in this.masterDependancyGraph)
  {
    this.masterDependancyGraph[v].visited=false;
  }

  return depGraph; 
}

Evaluator.prototype.doCalc=function(blnAsync)
{
  // we use currentInDegree to keep track of the inDegree during the calculation. 
  //currentIndegree=-1 means that the node is calculated.
  for (var v in this.calcGraph)
  {
    this.calcGraph[v].currentInDegree=this.calcGraph[v].inDegree ;
 
  }
  
  var allDone=false;
  if (blnAsync)
  {
    // start a single calc, and assume that calcs are starting the next calc by a callback.
    allDone=this.doSingleCalc(blnAsync);
  }
  else
  {
    // do all calcs in a loop.
    while (!allDone)
    {
      allDone=this.doSingleCalc(blnAsync);
    } 
  }
}

Evaluator.prototype.doSingleCalc=function(blnAsync)
{
    var allDone=true ;
    var cur=null;
    var info='';
    // find a node which can be calced. (that is: inDegree==0)
    for (var v in this.calcGraph)
    {
      allDone=allDone && (this.calcGraph[v].currentInDegree<0);
      if (this.calcGraph[v].currentInDegree==0)
      {
        cur=v;
        break ;
      }
      else
      {
        if (this.calcGraph[v].currentInDegree>=0)
        {
          info+=v+' ';
        }
      }
    }
    // if not all are done,but we found nothing?
    if (cur==null && !allDone) throw new Error("circular reference found in nodes: "+info);
    this.busy=!allDone;
    // if not all done but we found something.
    if (!allDone)
    {
      // We FIRST update the graph as if this calculation is done. 
      // the reason that this happens first is that async calls "never" come back, 
      // but rather restart the whole logic when they are finished.
      // so after doing the calcEvent there can be no further processing in this function.
      // decrease inDegree for dependant nodes.
      for (var i=0;i<this.calcGraph[cur].depList.length ; i++)
      {
        var depNode=this.calcGraph[cur].depList[i];
        if (!this.calcGraph[depNode])
        {
          throw new Error("node "+cur+" references non-existing node "+depNode);
        }
        this.calcGraph[depNode].currentInDegree--;
      }
      // mark current as done.
      this.calcGraph[cur].currentInDegree=-1;

      // NOW call the event to do the calculation.
      if (blnAsync)
      {
        var me=this;
        this.fireCalcEvent(cur,function() { me.doSingleCalc(true); });
      }  
      else
      {
        this.fireCalcEvent(cur);
      }
    }
    return allDone; 
}


/**** calc event ***/
Evaluator.prototype.fireCalcEvent=function(nodeName,callback)
{
  for (var i=0; i<this.arrListeners.length ; i++)
  {
    // apply
    this.arrListeners[i](nodeName,callback);
  }
}

Evaluator.prototype.addCalcEventListener=function(fn)
{
  this.arrListeners.push(fn);
}


/*** GraphItem class **/
function GraphItem(nodeName,depList)
{
  this.nodeName=nodeName;
  if (depList!=null) this.depList=depList; else this.depList=new Array();
  this.inDegree=0; // the degree of nodes this node is dependand of. 
  this.visited=false;
}
GraphItem.prototype.toString=function() {
  return this.nodeName+"(inDegree:"+this.inDegree+"): "+this.depList.join(", ");
}
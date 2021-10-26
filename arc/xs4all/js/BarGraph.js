function BarGraph(width,unit,noStack)
{
  this.width=width;
  this.unit=unit;
	this.noStack=noStack;
	this.predict=true;

  this.index={}; //hash array, for lookup index of a key in this.items
  this.items=[]; 
  this.group=-1; //do have multiple blocks per line
  this.groupLabels=[];

  //more colors: http://msdn.microsoft.com/workshop/author/dhtml/reference/colors/colors.asp?frame=true&toc=false
  this.groupColors=[
    'lawngreen','cornflowerblue','orangered','gold','mediumvioletred',
    'peachpuff','mediumpurple','palegreen','orangered','lightslategray',
		'linen','darkorange','teal','palegreen'];

  //calculated values
  this.minValue=Number.POSITIVE_INFINITY;
  this.maxValue=Number.NEGATIVE_INFINITY;
}


BarGraph.prototype.addItem=function(key,size,handle)
//--@key@Identifies an item
{
  var item=this.items[this.index[key]];
  if(!item)
  {
    //new item
    var idx=this.items.length;
    this.index[key]=idx;
    item=this.items[idx]=new BarGraphItem(this,handle);
  }
  item.addData(this.group,size);
}
BarGraph.prototype.beginGroup=function(name)
{
  this.groupLabels[++this.group]=name;
}
BarGraph.prototype._calcWidth=function(value)
{
	var width=parseInt((value-this.minValue)/(this.maxValue-this.minValue)*this.width,10);
	return width==0 ? 1 : width;
}
BarGraph.prototype.writeLegend=function()
{
  //legend
  document.write('<fieldset style="width:100%; border:1px solid lightgrey; padding:3px; margin-top:1em">'+
    '<legend>Legenda</legend>');
  for(var i=0; i<this.groupLabels.length; i++)
  {
    document.write('<div><img src="img/none.gif" style="height:8px;width:16px;background-color:'+this.groupColors[i]+';" /> '+
      this.groupLabels[i]+
      '</div>'
    );
  }
  document.write('</fieldset>');
}
BarGraph.prototype.writeGraph=function()
{
//	document.write('<p>'+this.minValue+','+this.maxValue+'</p>');
  if(this.items.length==0)
  {
    document.write('<em>Sorry, no data available</em>');
    return;
  }
  //there's data
  this.items.sort(BarGraphItem_compare);
  document.write('<table class="stats" width="100%">');
  for(var i=0; i<this.items.length; i++)
  {
    document.write(this.items[i].toString(i,this));
  }
  document.write('</table>');
}

function BarGraphItem(parent,handle)
{
  this.parent=parent;

  this.handle=handle;
  this.subitems=[];
  //calculated values
  this.sum=0;
}
function BarGraphItem_compare(e1,e2)
//--#is niet object-georienteerd in js, helaas...
//--#omgekeerd sorteren op property sum
{ 
  if(e1.sum>e2.sum) return -1;
  else if(e1.sum<e2.sum) return 1;
  else return 0;
}
BarGraphItem.prototype.addData=function(group,size)
{
	//debugger;
  this.subitems[group]=size;
  //calculated values;
  this.sum+=size;
	var mx=this.parent.noStack?size:this.sum; //wat is de maximum waarde voor de breedte
  this.parent.minValue=Math.min(this.parent.minValue,mx);
  this.parent.maxValue=Math.max(this.parent.maxValue,mx);
}
BarGraphItem.prototype.toString=function(pos,parent)
{
	var noStack=parent.noStack;
  var a=[], stl;
  a[a.length]='<tr><td class="number">'+(pos+1)+'</td>';
	if(noStack) {
		a[a.length]='<td>'+this.handle+'<br/><span style="font-size:80%;color:gray">('+this.sum+' '+parent.unit+')</span></td>';
	}
	else {
		a[a.length]='<td>'+this.handle+'</td>';
	}
  a[a.length]='<td nowrap>';
  for(var i=0; i<this.subitems.length; i++)
  {
    var subitem=this.subitems[i];
    if(subitem) 
    {
			stl='height:8px;width:'+parent._calcWidth(subitem)+'px;background-color:'+parent.groupColors[i]+';';
			if(noStack) stl+='border:1px solid lightgrey;position:relative;top:-'+i+'px';
      a[a.length]='<img src="img/none.gif" style="'+stl+'" title="'+parent.groupLabels[i]+' ('+subitem+' '+parent.unit+')" />';
			if(noStack) {
				if(i==parent.groupLabels.length-1 && parent.predict) { //last one
					//voorspelling voor de rest van de maand.
					var w=parent._calcWidth(subitem); //width
					var today=new Date().getDate(); //dag
					var days=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
					var prediction=parseInt(((w/today)*days)-w,10);
					stl='height:8px;width:'+prediction+'px;background-color:white;border:1px solid lightgrey;position:relative;left:-1px;top:-'+i+'px';
		      a[a.length-1]+='<img src="img/none.gif" style="'+stl+'" title="Voorspelling" />';
				}
				a[a.length-1]+='<br />';
			}
    }
  }
  if(!noStack) a[a.length]=' ('+this.sum+' '+parent.unit+')';
	else a[a.length]='<img src="img/none.gif" style="height:'+(8-i)+'px;" />';
	a[a.length]='</td></tr>';
  return a.join('');
}
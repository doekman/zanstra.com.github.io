function Traffic_compare(e1,e2)
//--#is niet object-georienteerd in js, helaas...
//--#omgekeerd sorteren op property hits
{ 
  if(e1.traffic>e2.traffic) return -1;
  else if(e1.traffic<e2.traffic) return 1;
  else return 0;
}

function cstats(select,color,stats)
//--#see-stats (as in C-stats)
{
  if(stats.length==0)
  {
    document.write('<em>Sorry, no data available</em>');
  }
  else
  {
    var units={hits:'hits',traffic:'Kb'};
    if(select=='traffic')
    {
      stats.sort(Traffic_compare);
    }
    var o=new BarGraph(400,0,stats[0][select],units[select],color);
    for(var i=0; i<stats.length; i++)
    {
      var item=stats[i];
      var size=parseInt(item.traffic/item.hits,10);
      var textLabel=item.name=='index' ? item.url.match(/([^\/]+\/)index.htm$/i)[1] : item.name;
      var text='<a href="'+item.url+'" title="'+item.relurl+' (&quot;average&quot; size is '+size+' kB)">'+textLabel+'</a>';
      o.addItem(text,item[select]);
    }
    o.toClient();
  }
}

function BarGraph(width,minValue,maxValue,unit,color)
{
  var imgs={red:'img/red.gif',blue:'img/blue.gif',none:'img/none.gif'};
  this.width=Number(width);
  this.minValue=Number(minValue);
  this.maxValue=Number(maxValue);
  this.unit=unit;
  this.img=imgs[color]||imgs.blue;
  this.lines=['<table class="stats">'];
  this.items=0;
}


BarGraph.prototype._calcWidth=function(value)
{
  return parseInt((value-this.minValue)/(this.maxValue-this.minValue)*this.width,10);
}

BarGraph.prototype.addItem=function(label,value)
{
  this.lines[this.lines.length]='<tr>'+
    '<td class="number">'+(++this.items)+'</td>'+
    '<td>'+label+'</td>'+
    '<td nowrap><img src="'+this.img+'" style="height:8px;width:'+this._calcWidth(value)+'px" title="'+this._calcWidth(value)+'"/> ('+value+' '+this.unit+')</td>'+
    '</tr>';
}

BarGraph.prototype.toClient=function()
{
  this.lines[this.lines.length]='</table>';
  document.writeln(this.lines.join('\n'));
}
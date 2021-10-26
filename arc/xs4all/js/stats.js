//constants
//define $maxhits above in HMTL, to limit the list
$baseurl='http://www.xs4all.nl/~zanstra/';
$htmlStatsFile='statistics.html';

function Hit(url,hits,traffic)
/*--#parse url and normalize url (handle default document)
and also normalize file-extension (.html and .html becomes htm)*/
{
  var re=/([^\/.]*)(\.([a-z0-9]+)){0,1}$/i;
  this.url=unescape(url);
  this.hits=parseInt(hits,10);
  this.traffic=parseInt(traffic,10);
  var ar=re.exec(url);
  if(ar)
  {
    this.name=ar[1];
    this.ext=ar[3];
    if(this.ext=='html') this.ext='htm';
  }
  if(!this.ext)
  {
    if(!this.name)
    {
      //url like: /~zanstra/
      this.url+='index.htm';
    }
    else 
    {
      //url like: /~zanstra
      this.url+='/index.htm';
    }
    this.name='index';
    this.ext='htm';
  }
  this.relurl=this.url.replace($baseurl,'');
}
Hit.prototype.toString=function()
{
  return '<a href="'+this.url+'">'+this.relurl+'</a> ('+this.hits+'x)';
//  return '<a href="'+this.url+'">'+this.relurl+'</a> ('+this.hits+' hits, '+this.traffic+'kB traffic)';
}
Hit.prototype.add=function(hit)
{
  this.size+=hit.size;
  this.traffic+=hit.traffic;
}
function Hit_compare(e1,e2)
//--#is niet object-georienteerd in js, helaas...
//--#omgekeerd sorteren op property hits
{ 
  if(e1.hits>e2.hits) return -1;
  else if(e1.hits<e2.hits) return 1;
  else return 0;
}

function getStats(s)
//--#Parses stats string
//--@s;type=string@String containing HTML generated by .stats
/*--@n;type=string;optional@Max number of items to be displayed. 
Suppy null or ommit parameter for max items.*/
//--@return@Named list (object): name=url, value is times executed
{
//1. <A href="http://www.xs4all.nl/~zanstra/default.css">http://www.xs4all.nl/~zanstra/default.css</A>                   267 (408Kb)
//debugger;
  var re=/\s[0-9]+\.\s<A href=\"([^\"]+)\">[^<]+<\/A>\s+([0-9]+)\s\(([0-9]+)Kb\)/i;
  //match 1: url, match 2: times, match 3: traffic
  var res={};
  var line=0, lines=s.split(/\r\n|\r|\n/);
  var arr=re.exec(lines[line]);
  var n=Number.POSITIVE_INFINITY;
  if(typeof $maxhits=='number') n=$maxhits;
  while(n>0&&line<lines.length)
  {
    if(arr!=null) //is there a match?
    {
      var x=new Hit(arr[1],arr[2],arr[3]);
      if(x.ext=='htm')
      {
        if(res[x.url])
        {
          res[x.url].add(x);
        }
        else
        {
          res[x.url]=x;
          n--; 
        }
      }
    }
    arr=re.exec(lines[++line])
  }
  res=toSortedArray(res);
  return res;
}
function toSortedArray(o)
{
  var p=[];
  for(var i in o)
  {
    p[p.length]=o[i];
  }
  p.sort( Hit_compare );
  return p;
}

var fOldOnLoad;
function pageInit()
{
  try
  {
    try
    {
      //IE
      var o=document.frames('stats').document;
    }
    catch(e)
    {
      //Mozilla (.conv
      o=document.getElementById('stats').contentDocument;
    }
  }
  catch(e)
  {
    return alert('Je hebt een te oude browser.\n\nStatistieken worden niet geladen.');
  }
  var p=getStats(o.body.innerHTML);
  document.getElementById('newStats').innerHTML='<li>'+p.join('</li><li>')+'</li>';
  if(typeof fOldOnLoad=='function')
  {
    fOldOnLoad();
  }
}

/*er is een bug met IFRAMEElement.contentDocument in combinatie met display:none,
dus daarom maar width/height van 0 enzo, dan gaat het wel goed in Navigator*/
document.writeln('<iframe id="stats" src="'+$htmlStatsFile+'" style="width:0px;height:0px;visibility:hidden;border-width:0px"></iframe>');
document.writeln('<ol id="newStats"><li>Loading...</li></ol>');

if(window.attachEvent) 
{
  //MS: IE
  window.attachEvent('onload',pageInit);
}
else if(window.addEventListener) 
{
  //DOM2: mozilla
  window.addEventListener('load',pageInit,false);
}
else 
{
  fOldOnLoad=window.onload;
  window.onload=pageInit;
}
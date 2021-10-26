Array.prototype.top=function(n) 
{ 
  n=(n||0)+1; 
  return this[this.length-n]||null; 
}
Array.prototype.exists=Array_exists;
function Array_exists(value) {
	for(var i=0; i<this.length; i++) {
		if(this[i]==value) {
			return true;
		}
	}
	return false;
}
String.prototype.reverse=function() {
  var s='';
  for(var i=this.length-1; i>=0; i--)
  {
    s+=this.charAt(i);
  }
  return s;
}
String.prototype.group=function String_group(n1,n2,b,sep)
/*--#Formateer de string in groepjes van [n1] cijfers. Gebruik [n2] als minimale
grootte van een groepje. Als [b] true is, doe het afwijkende groepje vooraan, 
anders achteraan. Gebruik [sep] als tussenvoegsel tussen de groepjes*/
//--@n1;type=integer;optional;default=3@Hoe groot een groepje cijfers moet zijn. n1>=1
//--@n2;type=integer;optional;default=2@Minimale lengte van een groepje cijfers. n2<=n1
//--@b;type=boolean;optional;default=false@Of het afwijkende groepje (indien deze voorkomt) vooraan moet staan.
//--@sep;type=string;optional;default=' '@De seperator.
{
  var re=new RegExp('([0-9]{1,'+n1+'})','g');
  var a, s;
  var ret=[];

  if(typeof n1=='undefined') n1=3;
  if(typeof n2=='undefined') n2=2;
  if(typeof b=='undefined') b=false;
  if(typeof sep=='undefined') sep=' ';
  if(b) s=this.reverse();
  else s=this;
  while(a=re.exec(s))
  {
    ret.push( a[1] );
  }
  if(ret.length>=2 && ret.top().length<n2)
  {
    //zijn er tenminste 2 groepjes en is de lengte van het laatste groepje te kort?
    var k=ret.top(1), l=ret.top(); //één-na-laatste en laatste
    if(parseInt((k.length+l.length)/2,10)>=n2) 
    {
      //2 groepjes maken
      ret[ret.length-1]=ret[ret.length-2].substr(n2)+ret[ret.length-1];
      ret[ret.length-2]=ret[ret.length-2].substring(0,n2);
    }
    else
    {
      //laatste 2 groepjes samenvoegen
      ret[ret.length-2]+=ret.pop();
    }
  }
  if(b) return ret.join(sep).reverse();
  else return ret.join(sep);
}

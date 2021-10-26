function ID(s)
{
  return document.getElementById(s);
}

function fix(n,i,blnMax)
{
  var s=String(n);
  if(s.length>i&&blnMax) s=s.substr(0,i);
  while(s.length<i) s='0'+s;
  return s;
}

function toCurrencyNumber(s)
{
  var a=s.match(/(\d*)[.,]{0,1}(\d{0,2})/);
  if(a.length==3)
  {
    if(a[1].length==0) a[1]='0';
    if(a[2].length==0) a[2]='0';
    return parseInt(a[1],10)*100 + parseInt(a[2],10);
  }
  else
  {
    return 0;
  }
}

function toCurrencyString(n)
{
  return String( fix(parseInt(n/100,10),1,false)+','+fix(parseInt(n%100,10),2,true) );
}

function toEuro(bln) 
{
  var n=toCurrencyNumber( ID(bln?'idGuilder':'idEuro').value );
  ID(bln?'idGuilder':'idEuro').value=toCurrencyString(n);
  n=parseInt(bln?n/2.20371:n*2.20371,10);
  ID(bln?'idEuro':'idGuilder').value=toCurrencyString(n);
}

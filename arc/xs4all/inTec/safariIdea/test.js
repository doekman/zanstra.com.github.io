Function.prototype.toStringRunnable=function()
{
  return this.toString().replace(/function (.*)\(/,'function <input type="button" value="$1" onclick="$1();" />(');
}
function showCode(f,comment)
{ 
  if(comment) document.write('<h3 class="code">'+comment+'</h3>');
  document.write('<pre>'+f.toStringRunnable()+'</pre>');
}

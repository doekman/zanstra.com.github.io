

/*** constants which tell the page in which phase it is. **/
RunEvent.MODUS_LOAD=0;
RunEvent.MODUS_PAGE=1;
RunEvent.MODUS_SAVE=2;


function RunEvent(o)
{
  try
  {
   evaluator.calc([o.id],true);
  }
  catch(e)
  {
      alert("Event  on "+o.id+" failed ");
      throw(e);
  }
}

/*
  this function is called whenever a page element needs updating.
  for pop:xxxxx it calls a corresponding Fill_xxxxx function.
  for xxxxx it does nothing, unless loading-> it loads the object from top.history.
*/
RunEvent.calc=function(nodeName,callback)
{
   debug('calc '+nodeName);
   if (nodeName.indexOf("pop:")==0)
   {
     var fn=eval("Fill_"+nodeName.substr(4));
     if (fn!=null)
     {
       fn(callback);  
     }
     else
     {
       throw new Exception("Event for "+nodeName+" is undefined");
     }
   }
   else
   {
     // for simple events we have to do nothing. except during loading.
     if (RunEvent.pageModus==RunEvent.MODUS_LOAD)
     {
        // TODO place value in control while loading.
     }
     callback();
   }
}
RunEvent.setModus=function(modus)
{
  RunEvent.pageModus=modus;
}
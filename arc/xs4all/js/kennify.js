// Original code from: http://www.namesuppressed.com/kenny/ 
function kennify(sx) 
{
  var tNormal={e:'mpp',t:'fmp',a:'mmm',o:'ppf',i:'mff',n:'ppp',s:'fmm',h:'mfp',r:'pff',d:'mpm',l:'pmf',c:'mmf',u:'fmf',m:'ppm',w:'fpp',f:'mpf',g:'mfm',y:'ffm',p:'pfm',b:'mmp',v:'fpm',k:'pmp',j:'pmm',x:'fpf',q:'pfp',z:'ffp',E:'Mpp',T:'Fmp',A:'Mmm',O:'Ppf',I:'Mff',N:'Ppp',S:'Fmm',H:'Mfp',R:'Pff',D:'Mpm',L:'Pmf',C:'Mmf',U:'Fmf',M:'Ppm',W:'Fpp',F:'Mpf',G:'Mfm',Y:'Ffm',P:'Pfm',B:'Mmp',V:'Fpm',K:'Pmp',J:'Pmm',X:'Fpf',Q:'Pfp',Z:'Ffp'};
  var tKennify={m:{pp:'e',mm:'a',ff:'i',fp:'h',pm:'d',mf:'c',pf:'f',fm:'g',mp:'b'},p:{pf:'o',pp:'n',ff:'r',mf:'l',pm:'m',fm:'p',mp:'k',mm:'j',fp:'q'},f:{mp:'t',mm:'s',mf:'u',pp:'w',fm:'y',pm:'v',pf:'x',fp:'z'},M:{pp:'E',mm:'A',ff:'I',fp:'H',pm:'D',mf:'C',pf:'F',fm:'G',mp:'B'},P:{pf:'O',pp:'N',ff:'R',mf:'L',pm:'M',fm:'P',mp:'K',mm:'J',fp:'Q'},F:{mp:'T',mm:'S',mf:'U',pp:'W',fm:'Y',pm:'V',pf:'X',fp:'Z'}};
  var i,sy='',c,d;

  if(/[a-eg-lnoq-z]/i.test(sx)) for(i=0; i<sx.length;i++) if(/[a-z]/i.test(c=sx.charAt(i))) sy+=tNormal[c]; else sy+=c; 
  else for (i = 0; i < sx.length; i++) {
      c=sx.charAt(i);
      if (i<sx.length-2) d=sx.substr(i+1,2); 
      else d='';

      if(!/[a-z]/i.test(c)) sy=sy+c;
      else if(tKennify[c]) {
        i+=2;
        if(tKennify[c][d]) sy+=tKennify[c][d];
      }
    }
  return sy;
}

function kenny4all(o)
{
  if(o&&o.childNodes&&o.childNodes.length>0)
  {
    var a=o.childNodes,ELEMENT=1,TEXTNODE=3;
    for(var i=0; i<a.length; i++)
    {
      var p=a[i];
      if(p.nodeType==TEXTNODE)
      {
        p.nodeValue=kennify(p.nodeValue);
      }
      else if(p.nodeType==ELEMENT)
      {
        kenny4all(p);
      }
    }
  }
}
kenny4all(document.body);
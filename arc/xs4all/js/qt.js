function setMovieHTML(url,w,h) 
{
	h=parseInt(h,10)+10;	 
	return '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" '+
	  'width="'+w+'" height="'+h+'">'+
		'<param name="target" value="quicktimeplayer">'+
		'<param name="src" value="'+url+'">'+
		'<param name="autoplay" value="true">'+
		'<param name="controller" value="true">'+
		'<embed pluginspage="http://www.apple.com/quicktime/download/" '+
		' type="video/quicktime" '+
		' width="'+w+'" height="'+h+'" '+
		' controller="true" autoplay="true" '+
		' src="'+url+'" '+
		' target="quicktimeplayer" > '+
		'</object>';
}
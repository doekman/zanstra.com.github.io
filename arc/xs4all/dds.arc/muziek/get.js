//after running, oGET represents the object, with propertie-names (get-names) and values (get-values)
function getParameter() {
	var aTemp=location.search.split('&');
	var aTemper;

	if(aTemp.length>0) {
		aTemp[0]=aTemp[0].substr(1); //Remove the questionmark
	}
	for(var i=0; i<aTemp.length; i++) {
		aTemper=aTemp[i].split('=');
		this[aTemper[0]]=aTemper[1];
	}
	delete aTemper, aTemp;
	return this;
}
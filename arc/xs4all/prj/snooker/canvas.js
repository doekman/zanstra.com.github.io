/*----------------------------------------------------------------------------\
|                                IE Canvas 1.0                                |
|                       Emulation Initialization Script                       |
|-----------------------------------------------------------------------------|
|                          Created by Emil A Eklund                           |
|                        (http://eae.net/contact/emil)                        |
|-----------------------------------------------------------------------------|
| Implementation of the canvas API for Internet Explorer. Uses VML.           |
|-----------------------------------------------------------------------------|
|                      Copyright (c) 2005 Emil A Eklund                       |
|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
| This program is  free software;  you can redistribute  it and/or  modify it |
| under the terms of the MIT License.                                         |
|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
| Permission  is hereby granted,  free of charge, to  any person  obtaining a |
| copy of this software and associated documentation files (the "Software"),  |
| to deal in the  Software without restriction,  including without limitation |
| the  rights to use, copy, modify,  merge, publish, distribute,  sublicense, |
| and/or  sell copies  of the  Software, and to  permit persons to  whom  the |
| Software is  furnished  to do  so, subject  to  the  following  conditions: |
| The above copyright notice and this  permission notice shall be included in |
| all copies or substantial portions of the Software.                         |
|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
| THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR |
| IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY, |
| FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE |
| AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER |
| LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING |
| FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER |
| DEALINGS IN THE SOFTWARE.                                                   |
|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
|                         http://eae.net/license/mit                          |
|-----------------------------------------------------------------------------|
| Dependencies: canvas.htc          - Actual implementation                   |
|-----------------------------------------------------------------------------|
| 2005-12-27 | Work started.                                                  |
| 2005-12-29 | First version posted.                                          |
|-----------------------------------------------------------------------------|
| Created 2005-12-27 | All changes are in the log above. | Updated 2005-12-29 |
\----------------------------------------------------------------------------*/


function ieCanvasInit() {
	var ie, opera, a, nodes, i, oVml, oStyle;
	
	/*
	 * Only proceed if browser is IE 6 or later (as all other major browsers
	 * support canvas out of the box there is no need to try to emulate for
	 * them, and besides only IE supports VML anyway.
	 */
	ie = navigator.appVersion.match(/MSIE (\d\.\d)/);
	opera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
	if ((!ie) || (ie[1] < 6) || (opera)) {
		return;
	}

	/* Get list of canvas elements */
	a = document.getElementsByTagName('canvas');	
	nodes = new Array();
	for (i = 0; i < a.length; i++) {
		node = a[0];
		nodes.push(node);
	}
	
	/* Recreate elements, as there is no canvas tag in HTML */
	while (nodes.length) {
		node = nodes[0];
		nodes.splice(0, 1);
		var newNode = document.createElement('canvas');
		newNode.id = node.id;
		newNode.style.width  = node.width;
		newNode.style.height = node.height;
		node.parentNode.replaceChild(newNode, node);
	}
	
	/* Add VML includes and namespace */
	document.namespaces.add("v");
	oVml = document.createElement('object');
	oVml.id = 'VMLRender';
	oVml.codebase = 'vgx.dll';
	oVml.classid = 'CLSID:10072CEC-8CC1-11D1-986E-00A0C955B42E';
	document.body.appendChild(oVml);
	
	/* Add required css rules */
	oStyle = document.createStyleSheet();
	oStyle.addRule('canvas', "behavior: url('canvas.htc');");
	oStyle.addRule('v\\:*', "behavior: url(#VMLRender);");
}


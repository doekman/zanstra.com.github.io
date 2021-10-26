function add_resource(type, filename, extra){
	//var container = document.getElementsByTagName('body');
	//container = container[container.length - 1];
	var insert_point = document.getElementById('ga_js');

	var resource = document.createElement(type);
	if (type=='script') {
		resource.src = filename;
		resource.type = 'text/javascript';
	}
	else if (type=='link') {
		resource.href = filename;
		resource.type = 'text/css';
		resource.rel = 'stylesheet';
	}
	else {
		resource.className = extra;
		resource.innerHTML = filename;
	}
	insert_point.parentNode.insertBefore(resource, insert_point);
}

function footer() {
	return [
		'  <span id="ligature_holder" class="abs footer">bq</span>',
		'  <span id="footnote">',
		'    Copyright &copy; D. Zanstra, 2007-2021',
		'    &ndash;',
		'    <a href="/my/">my index</a>',
		'    &ndash;',
		'    <a href="https://blog.zanstra.com/">my blog</a>',
		'    &ndash;',
		'    code is <a href="http://www.opensource.org/licenses/mit-license.php" title="Unless otherwise specified.">MIT Licensed</a>',
		'  </span>'
	].join('\n');
}
function init_footer() {
	add_resource('link', 'ga.css');
	add_resource('script', 'AnimatedDiv/AnimatedDiv.js');
	add_resource('p', footer(), 'footer')
}
// Pardon the shit, but this is migrated from an old .ASP site.
function start_animation() {
  var speed_step = 250; //ms
  var step_size = 3; //pixel step
  var ligature = document.getElementById("ligature_holder")
  ligature_animation = new AnimatedDiv(ligature, ['bq','dp','qb','pd'], speed_step);
  var footnote = document.getElementById('footnote'); //animate against
  var lupper = getLupper(footnote);
  ligature.style.top = (lupper[1] - 10) + 'px';
  var getMinLeft = function(lupper) {
    return lupper[0];
  };
  var getMaxRight = function(lupper) {
    return getMinLeft(lupper) + footnote.offsetWidth - ligature.offsetWidth;
  };
  var left = getMinLeft(lupper); //current left
  ligature_animation.start(function(n) { 
    var lupper = getLupper(footnote)
    ,   minLeft = getMinLeft(lupper)
    ,   maxRight = getMaxRight(lupper)
    ;
    left += step_size;
    if (left > maxRight && step_size > 0) {
      left = maxRight;
      step_size = -step_size;
    }
    else if (left < minLeft && step_size < 0) {
      left = minLeft;
      step_size = -step_size;
    }
    ligature.style.top = (lupper[1] - 10) + 'px'; //needed when resizing viewport (cmd+plus)
    ligature.style.left = left + 'px';
  });
}

var _old_onload=window.onload;
var ligature_animation;
window.onload = function(e) {
	init_footer();
	setTimeout(start_animation, 200);
  if (_old_onload) _old_onload(e);
}
var _old_onunload=window.onunload;
window.onunload = function() {
  ligature_animation.stop();
  if (_old_onunload) _old_onunload(e);
}

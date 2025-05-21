Handlebars.registerHelper('markdown', function (text) {
  return new Handlebars.SafeString(text ? marked(text) : '<em>undefined</em>');
});
Handlebars.registerHelper('join', function (array, seperator) {
    return (array||[]).join(seperator);
});
Handlebars.registerHelper('attr', function (condition, attribute, options) {
    return condition ? " " + attribute : "";
});
Handlebars.registerHelper('nattr', function (condition, attribute, options) {
    return condition ? "" : " " + attribute;
});
Handlebars.registerHelper('voud', function (waarde, enkelvoud, meervoud, options) {
  return waarde + " " + (waarde == 1 ? enkelvoud : meervoud);
});
Handlebars.registerHelper('whatis', function (title, param) {
  console.info("whatis %s: %O", title, param);
});
Handlebars.registerHelper('floor', function (value) {
  return Math.floor(+value);
});
Handlebars.registerHelper('fmtdate', function (value) {
  var dt = new Date(value);
  return format("%1-%2-%3 %4:%5", dt.getDate(), dt.getMonth(), dt.getFullYear(), dt.getHours(), dt.getMinutes());
});

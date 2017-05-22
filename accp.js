/* -------------------------------------------------------------------
* Copyright 2017 futomi  http://www.futomi.com/
* 2017-04-12
* ----------------------------------------------------------------- */
(function () {
/* -------------------------------------------------------------------
* URL of acclog.cgi
* ----------------------------------------------------------------- */
var acclog_cgi_url = '/acc/acclog.cgi';

/* ---------------------------------------------------------------- */
create_beacon();
function create_beacon() {
	var img = document.createElement("img");
	img.src = acclog_cgi_url + "?referrer=" + encodeURIComponent(document.referrer) + "&width=" + screen.width + "&height=" + screen.height + "&color=" + screen.colorDepth + "&epoch=" + new Date().getTime();
}
})();

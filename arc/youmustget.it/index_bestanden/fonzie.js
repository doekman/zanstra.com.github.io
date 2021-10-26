$(document).ready(function () {
    beCool();
});

function beCool(here) {
    here = here || document;
    here = $(here);
    here.find('.modal').modal({
        keyboard: true,
        backdrop: true
    }).bind('shown', function (e) {
        $(this).find('input:text:first').focus();
    });

    here.find('.tabs').tabs();

    here.find("button[type='submit']").click(function (e) {
        $(this).addClass("disabled");
        return true;
    });


    here.find('a.modaly').click(function (e) {
        var link = $(this);
        var url = link[0].href;
        var element = null;
        $(this).addClass("disabled");
        getElement(url, element, function (result) {
            hh = result.html || result;
            $('#spare-modal').html(hh);
            $('#spare-modal-launcher').click();
            beCool('#spare-modal');
        });

        e.preventDefault();
        return false;
    });

    here.find('a[data-recommended-by]').click(function (item) {
        $(item).html('someone!');
        //TODO
    });

    //modal forms... that want to submit...
    //grab em and redirect em.
    here.find('form').submit(function (e) {
        var form, url, action;
        form = $(this);
        url = form[0].action;
        data = toJson(form);
        element = form.closest(".modal,.span10");
        form.find('.progress').addClass('waiting');

        postElement(url, data, element, function (result) {
            if (result.redirectTo) {
                window.location = result.redirectTo;
            }
            if (result.html) {
                element.html(result.html);
                beCool(element);
            } else {
                if (result.success == false) {
                    notCool(result.message);
                }
                //what if no result.html and: result.success = true, or no result.success? 
            }
        });
        e.preventDefault();
        return false;
    });

    here.find('a[data-follow]').click(function (e) {
        var link = $(this);
        var url = link[0].href;
        var element = null;
        $(this).addClass("loading");
        getElement(url, element, function (res) {
            if (res.success == true) {
                link[0].outerHTML = "<strong>Followed ;-)</strong>";
            } else {
                link[0].outerHTML = "(Oops. It broke.)";
            }
        });

        e.preventDefault();
        return false;
    });

    here.find('a[data-unfollow]').click(function (e) {
        var link = $(this);
        var url = link[0].href;
        var element = null;
        $(this).addClass("loading");
        getElement(url, element, function (res) {
            if (res.success == true) {
                link[0].outerHTML = "<strong>Unfollowed :-(</strong>";
            } else {
                link[0].outerHTML = "(Oops. It broke.)";
            }
        });

        e.preventDefault();
        return false;
    });

    here.find('a.more').appear(function (e) {
        more(this);
        return true;
    });


    here.find('a.more').click(function (e) {
        more(this);
        e.preventDefault();
        return false;
    });

    //    here.find('form').submit(function (item) {
    //        var data, url, target;
    //        data = toJson($(item));
    //        url = $(item).data('url');
    //        element = $(item);
    //        postElement(url, data, element);
    //        return false;
    //    });

    //the signin form....
    //once it succeeds, reload entire screen...

    //signout... once it succeeds need to reload entire screen

    //buttons that cause an action to load elsewhere on screen... 
    //(e.g. in product list..., profile, etc.)
    //wire those up
}

function getElement(url, element, action) {
    // if no action is defined, we create a default success action...
    if (action == undefined) {
        action = function (result) {
            var html = result.html || result;
            $(element).html(html);
            beCool(element);
        };
    }
    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        success: action,
        beforeSend: function () {
            $(element).addClass('waiting');
        },
        complete: function () {
            $(element).removeClass('waiting');
        },
        error: function (xhr, s, e) {
            //$(element).removeClass('waiting');
            handleError(xhr, s, e);
        }
    });
}

function handleError(xhr, s, e) {
    /*  xhr.readyState, xhr.responseText, xhr.status, xhr.statusText;
    s: "error", e: "Internal Server Error";
    */
    //if is debug then
    var message = "";
    message += JSON.stringify(xhr, null, '\t').replace(/\\r/mg, '').replace(/\\n/mg, '<br />');
    notCool(message);
    //else -- try post error to error logging service.
}

function notCool(message) {
    //consider: append don't replace.
    $('#notCool').html(message);
}

function postId(url, elementID, successAction) {
    postElement(url, toJson($('#' + elementID)), $('#' + elementID), successAction);
}

function postElement(url, data, element, successAction) {
    if (successAction == undefined) {
        successAction = function (result) {
            var html = result.html || result;
            $(element).html(html);
            beCool(element);
        };
    }

    data = JSON.stringify(data);

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: successAction,
        beforeSend: function () {
            $(element).addClass('waiting');
        },
        complete: function () {
            $(element).removeClass('waiting');
        },
        error: handleError
    });
}

function toJson(form) {
    //find inputs
    var inputs = $(form).find(':input');
    var values = {};
    inputs.each(function () {
        if (!this.name) return; //unnamed inputs are typically submit buttons

        //for radio buttons and checkboxen return their jquery checked state
        if (this.type == "radio" || this.type == "checkbox") {
            values[this.name] = $(this).is(':checked');
        } else {
            //for all other inputs (buttons, textboxes, select and textareas, return their value
            if (values[this.name] == undefined) {
                values[this.name] = $(this).val();
            } else {
                //In mvc, checkboxes render an extraneous hidden field, containing 'false', that should be ignored.
                //so, if we've already gathered a value for this control (and it was true or false) then don't read this one in
                if (!this.type == "hidden" || (!values[this.name] == true && !values[this.name] == false)) {
                    values[this.name] = $(this).val();
                }
            }
        }
    });

    return values;
}

function jalert(o) {
    alert(JSON.stringify(o, null, '\t'));
}

function extractProduct(framey) {
    var iffy, title, price, imgUrl, heightWidth, oldWidth, oldHeight, newWidth, newHeight;

    iffy = $('iframe#iframe1').contents();
    if ($('html', iffy).html() == "<head></head><body></body>") {

        $('img.imgPreview').removeClass('loading');
        return;
    }

    title = iffy.find('#btAsinTitle').text(); //may be null, or may contain further html to be removed.

    if (title == null || title == "") {
        title = iffy.find('.featureProductInfo .sans a').text();
    }
    if (title == "") {
        title = iffy.find('#title').text();
    }

    //Remove square bracketed text from the title, e.g. [hardcover] [special] etc. And trim.
    if (title != "") {
        title = title.replace(/\[.+\]/g, '').replace(/^\s+|\s+$/g, '');
    }

    price = iffy.find('#actualPriceValue .priceLarge').text();
    if (price == null || price == "") {
        price = iffy.find('.featurePrice .price').text();
    }
    if (price == null || price == "") {
        price = iffy.find('.a-color-price.offer-price').text();
    }


    imgUrl = iffy.find('.featureImage a img').attr('src');
    if (imgUrl == null || imgUrl == "") {
        imgUrl = iffy.find('#prodImage').attr('src');
    }

    if (imgUrl == null || imgUrl == "") {
        imgUrl = iffy.find('#prodImageCell a img').attr('src');
    }

    if (imgUrl == null || imgUrl == "") {
        imgUrl = iffy.find('#imgBlkFront').attr('src');
    }
    if (imgUrl == null || imgUrl == "") {
        imgUrl = iffy.find('#main-image').attr('src');
    }

    var width, height, largestImageSize, largestImageUrl, largeTitle;

    if (imgUrl == null || imgUrl == "") {
        iffy.find('img').each(function (i) {
            width = 0;
            height = 0;
            width = $(this).attr("width");
            height = $(this).attr("height");
            if ((width * height) > largestImageSize) {
                largestImageSize = (width * height);
                largestImageUrl = this.src; // $(this).attr("src"); //absolute not relative
                largeTitle = $(this).attr("title");
                if (largeTitle == null || largeTitle == undefined || largeTitle == "") largeTitle = $(this).attr("alt");
            }
        });

        if (largestImageUrl != null) {
            imgUrl = largestImageUrl;
        }

        if (title == null || title == "") {
            title = largeTitle;
        }
    }

    //TODO: fix imgUrl .... and then calculate oldWidth and oldHeight
    // e.g. 
    //http: //ecx.images-amazon.com/images/I/41XaajbDktL._BO2,204,203,200AA300_SH20_OU01_.jpg
    //http: //ecx.images-amazon.com/images/I/41XaajbDktL.jpg

    if (title != null && title != "") $('#Title').val(title);
    if (price != null && price != "") $('#Price').val(price);
    if (imgUrl != null && imgUrl != "") {
        imgUrl = previewPhoto(imgUrl);
        $('#Photo').val(imgUrl);
    } else {
        $('img.imgPreview').removeClass('loading');
    }

    // And we're done 
}

function previewPhoto(imgUrl) {
    imgUrl = (imgUrl || "");

    //http: //ecx.images-amazon.com/images/I/51tsL8rUp6L._BO2,204,203,200_PIsitb-sticker-arrow-click,TopRight,35,-76_AA300_SH20_OU01_.jpg
    //http: //ecx.images-amazon.com/images/I/51tsL8rUp6L.jpg
    //Everything from ._   up to .  gets replaced with a .
    if (imgUrl.indexOf('amazon.com/') != -1) {
        imgUrl = imgUrl.replace(/\._[^.]+/g, '');
    }

    // load image (it may be modified and it may have been mis-sized originally)
    var newImg = new Image();
    newImg.src = imgUrl;
    $(newImg).ready(function () {
        // Once the image loads:
        // extract the raw sizes.
        var oldHeight = newImg.height;
        var oldWidth = newImg.width;

        // then scale sizes down.
        if (oldWidth >= oldHeight) {
            newWidth = 90;
            newHeight = (90 * oldHeight) / oldWidth;
        }
        else {
            newHeight = 90;
            newWidth = (90 * oldWidth) / oldHeight;
        }
        heightWidth = 'height: ' + Math.round(newHeight) + 'px ; width: ' + Math.round(newWidth) + 'px; min-height: ' + Math.round(newHeight) + 'px ; min-width: ' + Math.round(newWidth) + 'px;';
        // *then* apply image to preview. 

        var prev = $('img.imgPreview');
        prev.attr('src', imgUrl);
        if (heightWidth) {
            prev.attr('style', heightWidth);
        }

    });

    return imgUrl;
}

function extractASINfromUrl(url) {
    var urlParts = url.split('/');
    var i;
    for (i in urlParts) {
        if (looksLikeASIN(urlParts[i])) return urlParts[i];
    }
    //we failed to find the ASIN
    return null;
}

function looksLikeASIN(urlPortion) {
    if (urlPortion == '') return false;
    // Must be 10 char long.
    if (urlPortion.length != 10) return false;
    // Must be nothing but letters and numbers.
    if (urlPortion.match('^[a-zA-Z0-9]{10}$') == null) return false;
    // Must contain at least one digit. e.g. Not 'BlackBerry'
    if (urlPortion.match('[0-9]+') == null) return false;
    return true;
}

function affiliateAmazonUrl(url, affiliateId) {
    var ASIN = extractASINfromUrl(url);
    if (ASIN != null) {
        return 'http://amazon.com/exec/obidos/ASIN/' + ASIN + '/' + affiliateId;
    }
    // We failed to comprehend the url
    return null;
}

function more(t) {
    var link = $(t);
    var url = link[0].href;
    var element = null;
    //$(this).addClass("loading");
    link.closest('span').find('.progress').addClass('waiting');

    getElement(url, element, function (res) {
        if (res.success == true) {
            var p = link.closest('span');
            p.html(res.html);
            //link[0].outerHTML = res.html;
            beCool(p);
        } else {
            link[0].outerHTML = "(Oops. Nothing left.)";
        }
    });
}

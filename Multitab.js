var CheckWindowSessionIsValid_Mode;
var CheckWindowSessionIsValid_WindowNotValidURL;
var CheckWindowSessionIsValid_WebServiceURL;
var CheckWindowSessionIsValid_InProgress = false;
 
function CheckWindowSessionIsValid_Check() {
    if (CheckWindowSessionIsValid_InProgress) {
        return;
    }
 
    CheckWindowSessionIsValid_InProgress = true;
 
    var redirect = function () {
        if (CheckWindowSessionIsValid_Mode == "Blocking") {
            window.location.replace(CheckWindowSessionIsValid_WindowNotValidURL);
        }
    }
 
    if (localStorage.MultiTabWindowName > $(document).data('MultiTabWindowName')) {
        $.ajax({
            type: 'POST',
            async: false,
            url: CheckWindowSessionIsValid_WebServiceURL,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{}',
            cache: false,
            complete: redirect
        });
    }
 
    CheckWindowSessionIsValid_InProgress = false;
}
 
function CheckWindowSessionIsValid(Mode,
               WindowNotValidURL, WebServiceURL) {
    $(document).ready(function () {
        try {
            if (window.self !== window.top) {
                return;
            }
        } catch (e) {
            return;
        }
 
        $.ajaxSetup({
            cache: false
        });
 
        CheckWindowSessionIsValid_Mode = Mode;
        CheckWindowSessionIsValid_WindowNotValidURL = WindowNotValidURL;
        CheckWindowSessionIsValid_WebServiceURL = WebServiceURL;
 
        //Stop Multitab blocking
        if ($(document).find('.excludeFromMultiTabCheck').length) {
            return;
        }
 
        // Try catch has been added since localstorage is not available for Safari in Private Browsing mode.
        var windowName = new Date().getTime();
        try {
            localStorage.setItem('MultiTabWindowName', windowName);
        } catch (e) {
            // Do nothing
        }
 
        if (window.addEventListener) {
            window.addEventListener('storage', function (e) { if (e.key == 'MultiTabWindowName') { CheckWindowSessionIsValid_Check } }, false);
        } else {
            attachEvent('onstorage', function (e) { if (e.key == 'MultiTabWindowName') { CheckWindowSessionIsValid_Check } });
        }
 
        $(window).focus(CheckWindowSessionIsValid_Check);
 
        window.setTimeout(
            function () {
                windowName = new Date().getTime();
                $(document).data('MultiTabWindowName', windowName);
                try {
                    localStorage.setItem('MultiTabWindowName', windowName);
                } catch (e) {
                    // Do nothing
                }
            },
 
            1000);
    });
}
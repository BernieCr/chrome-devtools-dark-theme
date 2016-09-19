(function() {
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/theme.css", false);
    xhr.send();
    var theStyle = xhr.responseText;
    
    // var theStyle = '';
    //var theStyle = '';
    
    chrome.devtools.panels.applyStyleSheet(theStyle);
})();
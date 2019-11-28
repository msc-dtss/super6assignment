/**
 * Creates and sends a request
 * @param {String} endpoint The endpoint where to send the request
 * @param {String} httpMethod The HTTP method to use (defaults to GET)
 * @param {Function} successCallback The callback to execute when the request is successful
 * @param {Function} failCallback The callback to execute when the request fails
 * @param {*} content (optional) The body of the request in json format
 */
var makeRequest = function (endpoint, httpMethod, successCallback, failCallback, content) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Giving up :( Cannot create an XMLHTTP instance");
        return false;
    } else {
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                var data;
                try{
                    data = JSON.parse(httpRequest.responseText);
                } catch(ignored) {
                    data = null;
                }
                if(httpRequest.status >= 200 && httpRequest.status < 300){
                    successCallback(httpRequest.responseText, data);
                } else {
                    failCallback(httpRequest.status, httpRequest.responseText, data);
                }
            }
        };

        httpRequest.open(httpMethod || "GET", endpoint + window.location.search);

        if(!!content){
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(JSON.stringify(content));
        } else {
            httpRequest.send();
        }
    }
};

/**
 * Creates a RFC4122 UUID
 * 
 * Using the more compatible version
 * @see https://stackoverflow.com/a/2117523
 */
var uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

/**
 * Creates a new error message block
 * @param {String} content The html content to put inside the error
 */
var newErrorBlock = function (content) {
    var errorBlock = document.createElement('div');
    errorBlock.className = 'error out-of-view';
    errorBlock.id = uuid();
    errorBlock.innerHTML = content;
    return errorBlock;
}

/**
 * 
 * @param {Array} errors An array of `{message: "Error"}`
 * @param {Number} ttl The time in seconds until the message disappears
 */
var showError = function(errors, ttl) {
    const errorElement = document.querySelector('[error_holder]');
    if(errorElement) {
        for(var i=0; i < errors.length; i++){ 
            var errorBlock = newErrorBlock(errors[i].message);
            errorElement.append(errorBlock);
            setTimeout(function() {
                errorBlock.classList.remove("out-of-view");
            }, 1);
            setTimeout(function() {
                errorBlock.classList.add("out-of-view");
                setTimeout(function() {
                    errorElement.removeChild(errorBlock);
                }, 1);
            }, (ttl || 5) * 1000);
        }
    }
};
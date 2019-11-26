/**
 * Creates and sends a request
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
        httpRequest.open(httpMethod || "GET", endpoint);

        if(!!content){
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(JSON.stringify(content));
        } else {
            httpRequest.send();
        }
    }
};

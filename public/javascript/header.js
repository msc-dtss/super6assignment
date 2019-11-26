var colourBadFields = function (inputElement) {
    inputElement.style = "background:#FF5652;"; // We need to turn this into a class
};

var loginError = function (httpStatusCode, responseText, responseJson) {
    if (responseJson) {
        for (var i = 0; i < responseJson.errors.length; i++) {
            var elementName = responseJson.errors[i].param;
            colourBadFields(formElement.querySelector("[name='" + elementName + "']"));
        }
    }
};

var submitUserInfo = function (formId, endpoint) {
    var formElement = document.querySelector("#" + formId);
    var allInputFields = formElement.querySelectorAll("input");
    var formValues = {};
    var hasErrors = false;
    for (var i = allInputFields.length - 1; i >= 0; i--) {
        formValues[allInputFields[i].getAttribute("name")] = allInputFields[i].value;
        if (!allInputFields[i].checkValidity()) {
            allInputFields[i].reportValidity();
            hasErrors = true;
            colourBadFields(allInputFields[i]);
        }
    }

    if (hasErrors) {
        return false;
    }

    makeRequest(endpoint,
        "POST",
        function () {
            location.href = "/bets/play";
        },
        loginError,
        formValues
    );
};
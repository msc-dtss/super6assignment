/**
 * Marks a field as invalid
 * @param {*} inputElement An HTML element
 */
var colourField = function (inputElement, error, isValid) {
    if(isValid){
        inputElement.parentElement.classList.remove("invalid");
    } else {
        inputElement.parentElement.classList.add("invalid");
        const reasonHolder = inputElement.parentElement.querySelector("[reason]");
        if(!!reasonHolder){
            reasonHolder.innerHTML = error || "Invalid " + inputElement.getAttribute('name');
        }
    }
};

/**
 * Process errors when trying to login or register
 * @param {*} httpStatusCode The returned http status code
 * @param {*} responseText The response as text
 * @param {*} responseJson The response as json (could be null)
 */
var processErrors = function (formElement, responseJson) {
    if (!!responseJson) {
        for (var i = 0; i < responseJson.errors.length; i++) {
            if (!!responseJson.errors[i].param) {
                var elementName = responseJson.errors[i].param;
                colourField(formElement.querySelector("[name='" + elementName + "']"));
            } else if (responseJson.errors[i].code === "004") {
                colourField(formElement.querySelector("[name='email']"), responseJson.errors[i].message);
            } else if (responseJson.errors[i].code === "002") {
                colourField(formElement.querySelector("[name='email']"), responseJson.errors[i].message);
                colourField(formElement.querySelector("[name='password']"), responseJson.errors[i].message);
            }
        }
    }
};

/**
 * Submits all the input fields' values as JSON where the key is the input field's name.
 * @param {*} formId The ID of the form (or container element of the input fields)
 * @param {*} endpoint The endpoint to submit the information to
 */
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
            colourField(allInputFields[i]);
        } else {
            colourField(allInputFields[i], null, true);
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
        (httpStatusCode, responseText, responseJson) => {
            processErrors(formElement, responseJson)
        },
        formValues
    );
};
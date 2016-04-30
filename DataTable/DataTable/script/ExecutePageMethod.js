function ExecutePageMethod(page, fn, jsonParams, async, successFn, errorFn) {
    var paramList = '' + JSON.stringify(jsonParams) + '';

    $.ajax({
        type: "POST",
        url: page + "/" + fn,
        contentType: "application/json; charset=utf-8",
        data: paramList,
        async: async,
        dataType: "json",
        success: successFn,
        error: errorFn
    });
}
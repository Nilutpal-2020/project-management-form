let jpdbBaseUrl = "http://api.login2explore.com:5577";
let jpdbIRL = "/api/irl";
let jpdbIML = "/api/iml";
let projectDBName = "COLLEGE-DB";
let projectRelationName = "PROJECT-TABLE";
let connToken = "90932977|-31949275856000418|90949456";

$("#pid").focus();
$("#pname").prop("disabled", true);
$("#assigned_to").prop("disabled", true);
$("#assign_date").prop("disabled", true);
$("#deadline").prop("disabled", true);

function saveRecNo2LS(jsonObj) {
    let lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getpIdAsJsonObj() {
    let pid = $("#pid").val();

    let jsonStr = {
        id: pid
    };

    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    let record = JSON.parse(jsonObj.data).record;
    $("#pname").val(record.name);
    $("#assigned_to").val(record.assigned_to);
    $("#assign_date").val(record.assign_date);
    $("#deadline").val(record.deadline);
}

function resetForm() {
    $("#pid").val("");
    $("#pname").val("");
    $("#assigned_to").val("");
    $("#assign_date").val("");
    $("#deadline").val("");
    $("#pid").prop("disabled", false);
    $("#pname").prop("disabled", true);
    $("#assigned_to").prop("disabled", true);
    $("#assign_date").prop("disabled", true);
    $("#deadline").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#pid").focus();
}

function validateData() {
    let pid, pname, assigned_to, assign_date, deadline;
    pid = $("#pid").val();
    pname = $("#pname").val();
    assigned_to = $("#assigned_to").val();
    assign_date = $("#assign_date").val();
    deadline = $("#deadline").val();

    if (pid === "") {
        alert("Project ID is required");
        $("#empid").focus();
        return "";
    }

    if (pname === "") {
        alert("Project Name is required");
        $("#pname").focus();
        return "";
    }

    if (assigned_to === "") {
        alert("Assigned To is required");
        $("#assigned_to").focus();
        return "";
    }

    if (assign_date === "") {
        alert("Assign Date is required");
        $("#assign_ate").focus();
        return "";
    }

    if (deadline === "") {
        alert("Deadline is required");
        $("#deadline").focus();
        return "";
    }

    let jsonStrObj = {
        id: pid,
        name: pname,
        assigned_to: assigned_to,
        assign_date: assign_date,
        deadline: deadline
    }

    // console.log(jsonStrObj);

    return JSON.stringify(jsonStrObj);
}

function getProjectDetails() {
    let pIdJsonObj = getpIdAsJsonObj();
    let getRequest = createGET_BY_KEYRequest(connToken, projectDBName, projectRelationName, pIdJsonObj);
    jQuery.ajaxSetup({async: false});

    let resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#pname").prop("disabled", false);
        $("#assigned_to").prop("disabled", false);
        $("#assign_date").prop("disabled", false);
        $("#deadline").prop("disabled", false);
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#pname").focus();
    } else if (resJsonObj.status === 200) {
        $("#pid").prop("disabled", true);
        fillData(resJsonObj);

        $("#pname").prop("disabled", false);
        $("#assigned_to").prop("disabled", false);
        $("#assign_date").prop("disabled", false);
        $("#deadline").prop("disabled", false);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#pname").focus();
    }
}

function saveData() {
    let jsonStrObj = validateData();

    if (jsonStrObj === "") {
        return "";
    }

    let putRequest = createPUTRequest(connToken, jsonStrObj, projectDBName, projectRelationName);
    jQuery.ajaxSetup({async: false});
    
    let resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});

    resetForm();
}

function updateData() {
    $("#update").prop("disabled", true);
    jsonChg = validateData();
    let updateRequest = createUPDATERecordRequest(connToken, jsonChg, projectDBName, projectRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});

    let resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});

    // console.log(resJsonObj);

    resetForm();
}
// your code goes here ...
var module = (function () {
    // list containing household records
    var houseHoldList = [];
    // some constants for number validation
    var zeroCode = '0'.charCodeAt(0);
    var oneCode  = '1'.charCodeAt(0);
    var nineCode = '9'.charCodeAt(0);
    var maxAgeLimit = 130; // don't think we have humans older than that
    // constants for table
    var tableHeaders = ['Id', 'Age', 'Relationship', 'Smoker', 'ACTION'];
    // style constants
    var borderStyle = '1px solid black'
    // some id constants
    var tbodyID = 'houseHoldTableBody';
    // get input element (age)
    var ageElement = document.getElementById('age');
    // hook up event
    ageElement.addEventListener('keypress', function (e){
        var codeKey = e.key.charCodeAt(0);
        var text = e.target.value;
        // allow zeroes if text is not empty (no leading zeroes)
        var lowerLimitCode = text ? zeroCode : oneCode;
        if (codeKey < lowerLimitCode || codeKey > nineCode) {
            e.preventDefault();
        }
    });
    // get drop down element (relationship)
    var relElement = document.getElementById('rel');
    // get checkbox element (smoker?)
    var smokerElement = document.getElementById('smoker');
    // get add button element
    var addBtnElement = document.getElementsByClassName('add')[0];

    addRecord = function(e) {
        var ageValue = ageElement.value;
        if (ageValue.length == 0) {
            alert('must enter age!');
            e.preventDefault();
            return;
        }
        if (Number(ageValue) > maxAgeLimit) {
            alert('Age cannot be greater than ' + maxAgeLimit);
            ageElement.value = '';
            e.preventDefault();
            return;
        }
        relValue = relElement.value;
        if (relValue.length == 0) {
            alert('Select a relationship');
            e.preventDefault();
            return;
        }

        // all input fine at this point
        var record = {
            id: Date.now(), // some sort of identifier
            age: Number(ageValue),
            relationship: relValue,
            smoker: smokerElement.checked
        };
        // add a new record
        houseHoldList.push(record);
        // we need to reset the form
        resetForm();
        // we don't want to submit
        e.preventDefault();
        // update view
        updateView();
    };

    // hook up addRecord event
    addBtnElement.addEventListener('click', addRecord);
    // get submit button element
    var submitBtnElements = document.getElementsByTagName('button');
    var submitBtnElement;
    // find the one with type == 'submit'
    for (var i=0; i<submitBtnElements.length; i++) {
        if (submitBtnElements[i].type.toLowerCase() == 'submit') {
            submitBtnElement = submitBtnElements[i];
        }
    }

    submitForm = function (e) {
        if (houseHoldList.length == 0) {
            alert('No elements to submit');
            e.preventDefault();
        }
        // simulate server trip
        var dataToSend = JSON.stringify(houseHoldList);
        var sentReport = 'Data sent:' + dataToSend;
        preElement.innerText = sentReport;
        preElement.style.display = 'inline-block';
        setTimeout(function () {
            preElement.style.display = 'none';
        }, 2000); // hide after 2 secs
        // we don't want to submit
        e.preventDefault();
    };
    // hook up event to that particular button
    if (submitBtnElement) {
        submitBtnElement.addEventListener('click', submitForm)
    }

    // reset fields to default values
    resetForm = function () {
        ageElement.value = '';
        relElement.value = '';
        smokerElement.checked = false;
    }

    // some basic logging
    logList = function() {
        console.log(houseHoldList);
    }

    // will remove a record from list using id
    removeRecord = function(id) {
        // filter and re-set list
        houseHoldList = houseHoldList.filter(function (item) {
            return item.id !== +id; // we need it as number
        });
    }
    // debug element
    var preElement = document.getElementsByClassName('debug')[0];

    // Table placeholder section
    // create div for table element
    var divContainer = document.createElement('div');
    divContainer.id = 'table'
    // create table and headers (do this only once)
    var houseHoldTable = document.createElement('table');
    houseHoldTable.style.border = borderStyle;
    // table header
    var houseHoldTableHead = document.createElement('thead');
    // row for headers
    var houseHoldTableHeaderRow = document.createElement('tr');
    // iterate over all strings in header
    tableHeaders.forEach(function(item) {
        // current header cell for specific iteration
        var houseHoldHeader = document.createElement('th');
        houseHoldHeader.innerText = item;
        houseHoldHeader.style.border = borderStyle;
        // appends current header to header row
        houseHoldTableHeaderRow.append(houseHoldHeader)
    });
    // appends header row to the table header group element
    houseHoldTableHead.append(houseHoldTableHeaderRow);
    houseHoldTable.append(houseHoldTableHead);
    // create table body group element
    var houseHoldTableBody = document.createElement('tbody');
    houseHoldTableBody.id = tbodyID;
    // appends table body group element to table
    houseHoldTable.append(houseHoldTableBody);
    // appends table to div container
    divContainer.append(houseHoldTable);
    // hide div initially (no records)
    divContainer.style.visibility = 'hidden';
    // insert table div before debug section (as sibling)
    preElement.insertAdjacentElement('beforebegin', divContainer);


    // will inject data (houseHoldList) onto table body
    updateView = function() {
        // first we need to reset table body (remove existing )
        var tableBody = document.getElementById(tbodyID);
        // remove all children from body
        while(tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);
        // re-add children from the latest list
        houseHoldList.forEach(function(item) {
            var idTD = document.createElement('td');
            idTD.style.border = borderStyle;
            idTD.innerText = item.id;
            var ageTD =  document.createElement('td');
            ageTD.innerText = item.age;
            ageTD.style.border = borderStyle;
            var relationshipTD =  document.createElement('td');
            relationshipTD.innerText = item.relationship;
            relationshipTD.style.border = borderStyle;
            var smokerTD =  document.createElement('td');
            smokerTD.innerText = item.smoker;
            smokerTD.style.border = borderStyle;
            var actionTD = document.createElement('td');
            actionTD.style.border = borderStyle;
            // creating a button inside cell
            var btnAction = document.createElement('input');
            btnAction.type = 'button';
            btnAction.id = item.id;
            btnAction.value = 'delete';
            btnAction.onclick = function(e) {
                // console.log('removing item with id: ', e.target.id);
                // delete record with id
                removeRecord(e.target.id);
                // update the view (HTML)
                updateView();
            };
            // adding button to cell table
            actionTD.appendChild(btnAction);
            // create the data row
            var dataRow = document.createElement('tr');
            // add data elements
            dataRow.append(idTD, ageTD, relationshipTD, smokerTD, actionTD);
            // add row to table body
            tableBody.append(dataRow);
        });
        // set visibility based on whether table is empty or not
        divContainer.style.visibility = houseHoldList.length == 0 ? 'hidden' : 'visible';
    }

})();
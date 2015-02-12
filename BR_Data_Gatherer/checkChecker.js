/*
	Check for Checks
	Jesse Allison 2015
*/


var checkDict = new Dict('recentChecks');

var ajaxreq;


function bang() {
	var all_the_checks = checkDict.get('body');
	post(all_the_checks.length);
}

function updateChecks() {
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("GET","https://data.brla.gov/resource/g5c2-myyj.json");
	ajaxreq.onreadystatechange = checksLoaded;
	ajaxreq.send();
}

function checksLoaded() {
	post("loading");
	if (this.readyState ==4){
		var obj = JSON.parse(this.responseText);
		post("Object Returned: "+ obj);
		checkDict.setparse("body",this.responseText);
		post("Dictionary "+checkDict);
	}
}

function checkAmounts() {
	var all_the_checks = checkDict.get('body');
	for(var i=0; i < all_the_checks.length; i++) {
		var paymentDict = new Dict(all_the_checks[i]);
		var payment2 = paymentDict.get('gross_pay');
		debugDict.parse(paymentDict);
		
		var searchString = "body["+i+"]::gross_pay"; // body[0]::gross_pay
		var payment = checkDict.get(searchString);
		
		outlet(0, payment);
	}
}



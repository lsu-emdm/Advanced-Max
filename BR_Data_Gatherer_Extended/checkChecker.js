/*
	Check for Checks
	Jesse Allison 2015
*/

autowatch = 1;

outlets = 3;

// Global namespace to be able to access the sortedChecks array among different instances of this object
paychecks = new Global("paychecks");

var checkDict = new Dict('recentChecks');
var debugDict = new Dict('debug');

// All of the paycheck amounts taken from the JSON data
var paycheckAmounts = new Array();
paychecks.sortedChecks = new Array();  // a sorted version of all of the checks

// used for an ajaxrequest and a Task timer
var ajaxreq;
var t = new Task(ticker,this);



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

function getEntry(entry) {
	var searchString = "body["+entry+"]";
	// var searchString = "body["+entry+"]::data";
	outlet(2, searchString);
	var paymentEntry = checkDict.get(searchString);
	outlet(2, Object.prototype.toString.call(paymentEntry));
	
	outlet(2, paymentEntry.get("hire_date"));
	
	
	for (var key in paymentEntry) {
		outlet(2, key);
		outlet(2, paymentEntry.get(key));
  		/*if (paymentEntry.hasOwnProperty(key)) {
			outlet(2, paymentEntry.get(key));
  		}*/
	}

}

function checkAmounts() {
	var all_the_checks = checkDict.get('body');
	paycheckAmounts = [];
	
	for(var i=0; i < all_the_checks.length; i++) {
		// var paymentDict = new Dict(all_the_checks[i]);
		// var payment = paymentDict.get(i+'::gross_pay');
		// debugDict.parse(paymentDict);
		
		var searchString = "body["+i+"]::gross_pay"; // body[0]::gross_pay
		var payment = checkDict.get(searchString);
		paycheckAmounts.push(payment);
	}
	outlet(0, paycheckAmounts.length);
}

function sort() {
	paychecks.sortedChecks = paycheckAmounts.sort(function(a, b){return a-b});
	outlet(0, "High: ", paychecks.sortedChecks[paychecks.sortedChecks.length-1] , " Low: ",paychecks.sortedChecks[0]);
}

function setMulti() {
	for(var i = 1;i<paychecks.sortedChecks.length;i++) {
		outlet(1, "select",i,parseFloat(paychecks.sortedChecks[i]));
	}
}

function getMoney(i) {
	outlet(0, parseFloat(paychecks.sortedChecks[i]));
}

function checkMetro(enable) {
	if (enable == 1){
		t.interval = 250;
		t.repeat(100);
	} else {
		t.cancel();
	}
}

function ticker(a,b,c)
{
	//post("tick");
	this.getMoney(Math.floor(Math.random()*1000));
}





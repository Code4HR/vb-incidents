exports.numberWithCommas = function (x) {
	"use strict";
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
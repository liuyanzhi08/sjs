define(function() {
	'use strict'
	return {
		repeat: function(str, times) {
			var ret = '';
			for (var i = 0; i < times; i++) {
				ret += str;
			}
			return ret;
		}
		// ,
		// extend: function(target, from) {
		// 	for (var key in from) {
		// 		target[key] = from[key];
		// 	}
		// }
	}
})
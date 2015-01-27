define(['events', 'helper'], function(events, helper) {
	'use strict'

	var BIND = '*[data-bind]';
	var s = {};
	s.views = {};
	s.models = {};

	/**
	 * Init the app
	 */
	s.init = function() {
		render(document.body, addInfo);

		for (name in s.models) {
			// Init view
			// render(name);

			// Listen on model
			var model = s.models[name];
			for (var prop in model) {
				events.on('update:' + name + '.' + prop, function() {
					var binds = document.querySelectorAll(BIND);
					for (var i = 0, len = binds.length; i < len; i++) {
						var node = binds[i];
						var bindInfo = getBindInfo(node);
						if (bindInfo.type == 'text') {
							var value = eval(bindInfo.name);
							node.innerHTML = value;
						}
					}
				});
			}
		}
	}

	/**
	 * Define model
	 * @param  {string} name       The name of the model
	 * @param  {object} properties Properties of the model
	 * @return {object}            The defined model
	 */
	s.model = function(name, properties) {
		s.models[name] = {};
	    for (var prop in properties) {
	        (function(prop) {
	            Object.defineProperty(s.models[name], prop, {
	                // Create a new getter for the property
	                get: function () {
	                    return properties[prop];
	                },
	                // Create a new setter for the property
	                set: function (val) {
	                    properties[prop] = val;
	                    events.emit('update:' + name + '.' + prop);
	                },
	                enumerable: true
	            })
	        })(prop);
	    }
	    return s.models[name];
	}

	/**
	 * Update view
	 */
	var addInfo = {};
	function render(node, addInfo) {
		var bindInfo = getBindInfo(node);
		var recurse = true;
		var arrayName = '';

		if (bindInfo) {
			switch (bindInfo.type) {
				case 'model':
					addInfo['model'] = bindInfo.name;
					break;
				case 'foreach':
					var varNames = bindInfo.name.split('-');
					arrayName = varNames[varNames.length -1 ];

					var arr = addBindInfo(node, bindInfo, addInfo);

					// Get array value of model
					var arrValue = eval(arr);
					node.innerHTML = helper.repeat(node.innerHTML, arrValue.length);

					break;
				case 'text':
					var value = addBindInfo(node, bindInfo, addInfo);
					node.innerHTML = eval(value);

					recurse = false;
					break;
			}
		}
		// Recurse
		if (recurse) {
			var children = node.children;
			if (!children) return;

			for (var i = 0, len = children.length; i < len; i++) {
				arrayName && (addInfo[arrayName] = i);
				var child = children[i];
				render(child, addInfo);
				delete(addInfo[arrayName]);
			}
		}

	}

	/**
	 * Calculate the bind info of the given node
	 * @param  {dom} node The node
	 * @return {object}      Bind info: type and name
	 */
	function getBindInfo(node) {
		var text = node.dataset.bind;
		if (!text) return false;

		var x = text.indexOf(':');
		var type = text.substring(0, x);
		var name = text.substr(x + 1).replace(/(^\s*|\s*$)/g, '');
		return {
			type: type,
			name: name
		}
	}

	/**
	 * Add model name as prefix for bind val
	 * @param {dom} node     Node to add
	 * @param {object} bindInfo Bindinfo object
	 */
	function addBindInfo(node, bindInfo, addInfo) {
		var name = bindInfo.name;
		name = name.replace(/([^-\s]+)(-|\b)/g, "['$1']");

		var key, value,  ret;
		for (key in addInfo) {
			if (key == 'model') continue;

			value = addInfo[key]; 
			name = name.replace("'" + key + "'", "'" + key + "']['" + value + "'");
		}
		ret = "s.models['" + addInfo['model'] + "']" + name;

		node.dataset.bind = bindInfo.type + ": " + ret;

		return ret;
	}

	return s;
})
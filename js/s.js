define(['tpl', 'events'], function(tpl, events) {
	'use strict'

	var NODENAME = 'model'
	var s = {};
	s.views = {};
	s.models = {};

	/**
	 * Init the app
	 */
	s.init = function() {
		generateViews();

		for (name in s.models) {
			// Init view
			update(name);

			// Listen on model
			events.on('update:'+name, function() {
				update(name);
			});
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
	    for (var i in properties) {
	        (function(i) {
	            Object.defineProperty(s.models[name], i, {
	                // Create a new getter for the property
	                get: function () {
	                    return properties[i];
	                },
	                // Create a new setter for the property
	                set: function (val) {
	                    properties[i] = val;
	                    events.emit('update:'+name);
	                }
	            })
	        })(i);
	    }
	    return s.models[name];
	}

	/**
	 * Update view
	 * @param  {string} name The name of the view
	 */
	function update(name) {
		s.views[name].node.innerHTML = s.views[name].tpl(s.models[name]);
	}

	/**
	 * Generate views
	 */
	function generateViews() {
		var nodes = document.querySelectorAll('*[data-' + NODENAME + ']');
		for (var i = 0, len = nodes.length; i < len; i++) {
			var node = nodes[i];
			var name = node.dataset[NODENAME];
			s.views[name] = {
				node: node,
				tpl: tpl(node.innerHTML)
			}
		}
	}
	return s;
})
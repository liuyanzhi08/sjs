define(['s'], function(s) {
	test = s.model('test', {
		name: 'lyz',
		score: 100
	})
	s.init();
	
	test.name = 'yzl';	
})

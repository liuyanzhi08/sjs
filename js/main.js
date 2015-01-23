define(['s'], function(s) {
	test = s.model('test', {
		id: 0,
		name: 'lyz',
		blogsNum: 3,
		blogs: [
			{
				id: 0, 
				name: 'blog', 
				commentsNum: 3,
				comments: [
					{id: 0, name: 'comment'},
					{id: 1, name: 'comment1'},
					{id: 2, name: 'comment2'}
				]},
			{id: 1, name: 'blog1'}
		]
	})

	s.init();
	
	test.blogs = 'yzl';	
})


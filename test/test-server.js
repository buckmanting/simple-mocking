const {startMockingServer} = require('../src/mocks-server');

startMockingServer({
	port: 5050,
	mockData: {
		api: {
			v1: {
				users: {
					1: {
						firstName: 'John',
						lastName: 'Doe',
						age: 30,
						address: {
							street: '123 Main St',
							city: 'New York',
							state: 'NY',
							zip: '10001'
						}
					}
				},
				posts: {
					1: {
						title: 'Post 1',
						body: 'This is post 1'
					},
					2: {
						title: 'Post 2',
						body: 'This is post 2'
					}
				},
				institutions: {
					// __options can be a function that returns an object, or an object
					__options: () => {
						return {name: 'Institution', id: 1};
					},
				},
				class:{
					// __metadata contains supplemental information about the mock, such as
					// the response status code and headers
					__metadata: {
						response:{
							statusCode: 302,
							headers: {
								Location: 'https://www.google.com'
							}
						}
					}
				}
			}
		}
	}
});

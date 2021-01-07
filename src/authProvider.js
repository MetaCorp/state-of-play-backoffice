import { gql } from '@apollo/client';
import { AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT } from 'react-admin';


const authProvider = client => (type, params) => {

	if (type === AUTH_LOGIN) {

		return client.mutate({
			mutation: gql`
				mutation login($email: String!, $password: String!) {
					login(email: $email, password: $password) {
						token
						admin
					}
				}
			`,
			variables: {
				email: params.username,
				password: params.password
			}
		}).then(result => {
			if (result.data && result.data.login && result.data.login.token && result.data.login.admin)
				localStorage.setItem('token', result.data.login.token);
		})

		// return fetch(request)
		// 	.then(response => {
		// 		if (response.status < 200 || response.status >= 300) {
		// 			throw new Error(response.statusText);
		// 		}
		// 		return response.json();
		// 	})
		// 	.then(({ token }) => {
		// 		localStorage.setItem('token', token);
		// 	});

	}

	if (type === AUTH_CHECK) {
		return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
	}

	if (type === AUTH_LOGOUT) {
		localStorage.removeItem('token');
	}

	return Promise.resolve();
}

export default authProvider
import { gql } from '@apollo/client'

const firstLowerCase = str => str.charAt(0).toLowerCase() + str.slice(1);

const buildFieldList = (name) => {
	switch (name) {
		case 'users':
			return `
				id
				firstName
				lastName
				email
				credits
			`
		case 'user':
			return `
				id
				firstName
				lastName
				email
				credits
			`
		case 'updateUserAdmin':
			return `
				id
				firstName
				lastName
				email
				credits
			`
	}
}

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
	const resource = introspectionResults.resources.find(r => r.type.name === resourceName);

	console.log('buildQuery introspectionResults: ', introspectionResults)
	console.log('buildQuery resource: ', resource)
	console.log('buildQuery resourceName: ', resourceName)
	console.log('buildQuery raFetchType: ', raFetchType)
	console.log('buildQuery params: ', params)

	switch (raFetchType) {
		case 'GET_ONE':
			return {
				query: gql`query ${resource[raFetchType].name}($data: ${resourceName}Input) {
					data: ${resource[raFetchType].name}(data: $data) {
						${buildFieldList(resource[raFetchType].name)}
					}
				}`,
				// ${buildFieldList(introspectionResults, resource, raFetchType)}
				variables: {
					data: {
						[firstLowerCase(resourceName) + 'Id']: params.id
					}
				},
				parseResponse: response => response.data,
			}
		case 'GET_LIST':
			return {
				query: gql`query ${resource[raFetchType].name} {
					data: ${resource[raFetchType].name} {
						${buildFieldList(resource[raFetchType].name)}
					}
				}`,
				// ${buildFieldList(introspectionResults, resource, raFetchType)}
				// variables: params, // params = { id: ... }
				parseResponse: response => ({
					data: response.data.data,
					total: response.data.data.length
				}),
			}
		case 'UPDATE':
			params.data.__typename = undefined
			return {
				query: gql`mutation ${resource[raFetchType].name}($data: Update${resourceName}AdminInput!) {
					data: ${resource[raFetchType].name}(data: $data) {
						${buildFieldList(resource[raFetchType].name)}
					}
				}`,
				// ${buildFieldList(introspectionResults, resource, raFetchType)}
				variables: {
					data: params.data
				},
				parseResponse: response => response.data,
			}
		// ... other types handled here
	}
}

export default buildQuery
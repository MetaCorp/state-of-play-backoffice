import { useMediaQuery } from '@material-ui/core';
import {
	Datagrid,
	List,
	SimpleList,
	TextField,
	Create,
	Edit,
	SimpleForm,
	TextInput,
	NumberInput,
	DateInput,
	ReferenceManyField,
	DateField,
	EditButton,
	BooleanField,
	BooleanInput,
	required
} from 'react-admin';

import memoize from 'lodash/memoize';



export const UserCreate = (props) => {
    console.log('UserCreate props: ', props)

    return <div></div>
}

export const UserEdit = (props) => {
    console.log('UserEdit props: ', props)

    return (
			<Edit {...props}>
        <SimpleForm>
					<TextInput disabled label="Id" source="id" />
					<TextInput source="firstName" validate={required()} />
					<TextInput source="lastName" validate={required()} />
					<NumberInput source="credits" validate={required()} />
					<BooleanInput source="isAdmin" validate={required()} />
					{/* <TextInput multiline source="teaser" validate={required()} /> */}
					{/* <RichTextInput source="body" validate={required()} /> */}
					{/* <DateInput label="Publication date" source="published_at" /> */}
					{/* <ReferenceManyField label="Comments" reference="comments" target="post_id">
						<Datagrid>
							<TextField source="body" />
							<DateField source="created_at" />
							<EditButton />
						</Datagrid>
					</ReferenceManyField> */}
        </SimpleForm>
    </Edit>
		)
}

const rowClick = memoize(permissions => (id, basePath, record) => {
	return permissions === 'admin'
			? Promise.resolve('edit')
			: Promise.resolve('show');
});

export const UserList = ({ permissions, ...props }) => {
	console.log('UserList props: ', props)

	return (
		<List
			{...props}
			// filters={<UserFilter permissions={permissions} />}
			filterDefaultValues={{ role: 'user' }}
			sort={{ field: 'name', order: 'ASC' }}
			// aside={<Aside />}
			// bulkActionButtons={<UserBulkActionButtons />}
		>
			{useMediaQuery(theme => theme.breakpoints.down('sm')) ? (
				<SimpleList
					primaryText={record => record.name}
					secondaryText={record =>
						permissions === 'admin' ? record.role : null
					}
				/>
			) : (
				<Datagrid
					rowClick={rowClick(permissions)}
					// expand={<UserEditEmbedded />}
					optimized
				>
					<TextField source="id" />
					<TextField source="firstName" />
					<TextField source="lastName" />
					<TextField source="email" />
					<TextField source="credits" />
					<BooleanField source="isAdmin" />
					{permissions === 'admin' && <TextField source="role" />}
				</Datagrid>
			)}
		</List>
	)
}
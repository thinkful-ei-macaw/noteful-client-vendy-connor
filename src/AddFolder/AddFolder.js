import React, { Component } from 'react';
import config from '../config';
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types'

class AddFolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: {
				value: ''
			}
		};
	}

	static defaultProps = {
		onAddFolder: () => { }
	}
	static contextType = ApiContext;

	updateName(name) {
		this.setState({ name: { value: name } });
	}

	validateName = () => {
		let name = this.state.name.value;
		name = name.replace(/[\s-]/g, '');
		if (name.length === 0) {
			return 'Name must contain atleast 1 character'
		}
	}

	onAddFolder = e => {
		e.preventDefault()
		// const folderId = this.props.id
		const body = { name: e.target.folderinput.value };
		console.log(body);
		fetch(`${config.API_ENDPOINT}/folders`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body)
		})
			.then(res => {
				if (!res.ok)
					return res.json().then(e => Promise.reject(e))
				return res.json()
			})
			.then((resJson) => {
				//this.context.addFolder(folderId)
				// allow parent to perform extra behaviour
				this.context.addFolder(resJson)
				this.props.history.push('/')
			})
			.catch(error => {
				console.error({ error })
			})
	}

	render() {
		return (
			<div>
				<label htmlFor="add-folder-form">Add New Folder</label>
				<form name="add-folder-form" onSubmit={this.onAddFolder}>
					<label htmlFor="folderinput">Folder Name: <div>{this.validateName()}</div> </label>
					<input id="folderinput" name="folderinput" type="text" onChange={e => this.updateName(e.target.value)} />
					<button type="submit" disabled={
						this.validateName()} >Submit </button>
				</form>
			</div>
		)
	}
}

AddFolder.propTypes = {
	onDeleteNote: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired

}

export default AddFolder;

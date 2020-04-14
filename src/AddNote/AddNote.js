import React, { Component } from 'react';
import config from '../config';
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types'

class AddNote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: {
				value: ''
			},
			folderId: {
				value: ''
			},
			content: {
				value: ''
			}
		}
	}
	updateName(name) {
		this.setState({ name: { value: name } });
	}

	// updateFolderId(folderId) {
	// 	this.setState({ folderId: { value: folderId } });
	// }

	updateContent(content) {
		this.setState({ content: { value: content } });
	}

	validateName = () => {
		let name = this.state.name.value;
		name = name.replace(/[\s-]/g, '');
		if (name.length === 0) {
			return 'Name must contain atleast 1 character'
		}
	}

	validateContent = () => {
		let content = this.state.content.value;
		content = content.replace(/[\s-]/g, '');
		if (content.length === 0) {
			return 'Content must contain atleast 1 character'
		}
	}

	static defaultProps = {
		onAddNote: () => { }
	}
	static contextType = ApiContext;

	onAddNote = e => {
		e.preventDefault()
		console.log(this.props)
		// const folderId = this.props.id
		const body = {
			note_name: e.target.noteNameInput.value,
			folder_id: e.target.folder.value,
			modified: new Date(),
			content: e.target.noteContent.value
		};
		console.log(body);
		fetch(`${config.API_ENDPOINT}/notes`, {
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
				this.context.addNote(resJson)
				this.props.history.push('/')
			})
			.catch(error => {
				console.error({ error })
			})
	}

	render() {
		let { folders = [] } = this.context;
		let options = folders.map(folder => {
			return <option value={folder.id}>{folder.folder_name}</option>
		})
		return (
			<div>
				<label htmlFor="add-note-form">Add New Note</label>
				<form name="add-note-form" onSubmit={this.onAddNote}>
					<label htmlFor="noteNameInput">Note Name: <div>{this.validateName()}</div> </label>
					<input id="noteNameInput" name="noteNameInput" type="text" onChange={e => this.updateName(e.target.value)} />
					<label htmlFor="folder">Folder: </label>
					<select id="folder" name="folder">{options}</select>
					<label htmlFor="NoteContent">Note Content: {this.validateContent()}</label>
					<input id="noteContent" name="NoteContent" type="text" />
					<button type="submit" disabled={
						this.validateName()
					} >Submit</button>
				</form>
			</div>
		)
	}
}

AddNote.propTypes = {
	history: PropTypes.object.isRequired
}

export default AddNote;

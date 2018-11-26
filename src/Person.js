import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteContact } from "./actions/contactActions";
class Person extends Component {
	handleEditClick = e => {
		e.preventDefault();
		this.props.dispatch({ type: "SHOW_EDIT_FORM", id: this.props.person.id, person: this.props.person });
	};

	handleDelete = e => {
		e.preventDefault();

		deleteContact(this.props.person.id);
		this.props.dispatch({ type: "DELETE", id: this.props.person.id });
	};

	render() {
		let person = this.props.person;

		return (
			<tr>
				<td>{person.id}</td>
				<td>
					<img src={`public/img/${person.profile}`} />
				</td>
				<td>{person.name}</td>
				<td>{person.age}</td>
				<td>
					<button onClick={this.handleEditClick}>Edit</button>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		);
	}
}

export default connect()(Person);

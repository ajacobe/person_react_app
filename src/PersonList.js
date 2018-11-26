import React, { Component } from "react";
import Person from "./Person";
import { connect } from "react-redux";
import { fetchContacts } from "./actions/contactActions";
import myConfig from "./config";
class PersonList extends Component {
	constructor(props) {
		super(props);
		console.log(myConfig.apiUrl);
		this.state = { id: 0, person: {}, completed: 1, toShow: { display: "block" } };
		this.api = "http://api.local/api.php";
	}

	handleSubmit = e => {
		e.preventDefault();
		const newId = this.props.persons.length + 1;

		const data = {
			id: newId,
			name: e.target.name.value,
			age: e.target.age.value,
			profile: ""
		};

		this.props.dispatch({ type: "ADD", data, action: "" });

		this.onAdd(data);
	};

	handleUpdate = e => {
		e.preventDefault();

		let target = e.target;
		const file = target.profile.files[0] ? target.profile.files[0] : "";
		const data = {
			id: target.id.value,
			name: target.name.value,
			age: target.age.value,
			profile: file ? file.name : ""
		};

		this.onUpdate(data, file);

		if (data.profile != "") {
			this.props.dispatch({ type: "UPDATE", data, action: "edit", id: data.id });
		} else {
			this.props.dispatch({ type: "UPDATE", data, action: "", id: data.id });
		}
	};

	onUpdate = (data, file) => {
		this.processProfileData("update_profile", data, file);
	};

	processProfileData = (type, data, file) => {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", this.api + "?action=" + type);
		if (data.profile != "") {
			xhr.upload.addEventListener("progress", this.uploadInProgress);
			xhr.upload.addEventListener("load", this.uploadInComplete);
			xhr.setRequestHeader("Accept", "application/json");
			let reader = new FileReader();
			reader.onload = function(e) {
				let img_file = { data, title: file.name, file: reader.result };
				xhr.send(JSON.stringify(img_file));
			};
			reader.readAsDataURL(file);
		} else {
			xhr.send(JSON.stringify({ data }));
		}
	};

	onAdd = (data, file) => {
		this.processProfileData("create_new", data, file);
	};

	uploadInComplete = e => {
		this.setState({ completed: 100 });
		setTimeout(this.props.dispatch({ type: "HIDE_EDIT_ADD_FORM", action: "" }), 1000);
	};

	uploadInProgress = e => {
		if (e.lengthComputable) {
			let percentage = Math.round((e.loaded * 100) / e.total);
			this.setState({ completed: percentage });
		}
	};

	handleAddClick = e => {
		e.preventDefault();

		this.props.dispatch({ type: "SHOW_ADD_FORM", action: "add" });
	};

	componentDidMount() {
		fetchContacts().then(data => {
			this.props.dispatch({ type: "FETCH_PERSONS", action: "", persons: data });
		});
	}

	renderPersonForm = params => {
		let person = params.person;
		let action = params.action;
		let width = this.state.completed ? this.state.completed : 1;
		const style = { width: width + "%", backgroundColor: "#4caf50", height: "30px" };

		const btnLabel = action === "add" ? "Add" : "Update";
		const toShow = this.state.toShow;

		return (
			<form onSubmit={action === "edit" ? this.handleUpdate : this.handleSubmit}>
				<input type="hidden" defaultValue={person.id ? person.id : null} name="id" />
				<input type="text" defaultValue={person.name ? person.name : ""} name="name" />
				<input type="number" defaultValue={person.age ? person.age : 0} name="age" />
				{action === "edit" ? <input name="profile" type="file" accept="image/*" /> : ""}
				<button>{btnLabel}</button>
				{action === "edit" ? (
					<div style={toShow} className="progress">
						<div style={style} />
					</div>
				) : (
					""
				)}
			</form>
		);
	};

	renderAddPersonBtn = () => {
		return <button onClick={this.handleAddClick}>Add New Person </button>;
	};

	render() {
		let props = this.props;
		let action = props.action;
		const person = props.person;

		let renderForm;
		if (action === "") {
			renderForm = this.renderAddPersonBtn();
		} else if (action === "add" || action === "edit") {
			renderForm = this.renderPersonForm(props);
		}

		let persons = props.persons;
		let rows = persons.map(person => <Person key={person.id} api={this.api} person={person} />);
		return (
			<div>
				{renderForm}

				<table>
					<thead>
						<tr>
							<td>Id</td>
							<td>Profile</td>
							<td>Name</td>
							<td>Age</td>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</div>
		);
	}
}

const mapsStatetoProps = state => ({
	persons: state.persons,
	id: state.id,
	person: state.person,
	action: state.action
});
export default connect(mapsStatetoProps)(PersonList);

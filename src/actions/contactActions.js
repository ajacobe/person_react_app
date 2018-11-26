export function fetchContacts() {
	return fetch(api + "?action=fetch").then(res => {
		var contentType = res.headers.get("content-type");
		if (contentType && contentType == "application/json") {
			return res.json();
		} else {
			throw new TypeError("Oops, we required JSON data");
		}
	});
}

export function deleteContact(id) {
	return fetch(api + "?action=delete&id=" + id).then(res => res);
}

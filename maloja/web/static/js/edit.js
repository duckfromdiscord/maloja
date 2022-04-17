// JS for all web interface editing / deletion of scrobble data



function toggleDeleteConfirm(element) {
	element.parentElement.parentElement.classList.toggle('active');
}

function deleteScrobble(id,element) {
	element.parentElement.parentElement.parentElement.classList.add('removed');

	neo.xhttpreq("/apis/mlj_1/delete_scrobble",data={'timestamp':id},method="POST",callback=(()=>null),json=true);

}


function selectAll(e) {
	// https://stackoverflow.com/a/6150060/6651341
	var range = document.createRange();
    range.selectNodeContents(e);
	var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function editEntity() {

	var namefield = document.getElementById('main_entity_name');
	namefield.contentEditable = "plaintext-only";

	namefield.addEventListener('keydown',function(e){
		// dont allow new lines, done on enter
		if (e.key === "Enter") {
			e.preventDefault();
			namefield.blur(); // this leads to below
		}
		// cancel on esc
		else if (e.key === "Escape" || e.key === "Esc") {
			e.preventDefault();
			namefield.innerHTML = entity_name;
			namefield.blur();
		}

	})
	// emergency, not pretty because it will move cursor
	namefield.addEventListener('input',function(e){
		if (namefield.innerHTML.includes("\n")) {
			namefield.innerHTML = namefield.innerHTML.replace("\n","");
		}

	})

	// manually clicking away OR enter
	namefield.addEventListener('blur',function(e){
		doneEditing();

	})

	namefield.focus();
	selectAll(namefield);
}

function doneEditing() {
	var namefield = document.getElementById('main_entity_name');
	namefield.contentEditable = "false";
	newname = namefield.innerHTML;

	if (newname != entity_name) {
		var searchParams = new URLSearchParams(window.location.search);

		if (entity_type == 'artist') {
			var endpoint = "/apis/mlj_1/edit_artist";
		    searchParams.set("artist", newname);
			var payload = {'id':entity_id,'name':newname};
		}
		else if (entity_type == 'track') {
			var endpoint = "/apis/mlj_1/edit_track";
		    searchParams.set("title", newname);
			var payload = {'id':entity_id,'title':newname}
		}

		neo.xhttpreq(
			endpoint,
			data=payload,
			method="POST",
			callback=(()=>window.location = "?" + searchParams.toString()),
			json=true
		);
	}


}

function changeTab(id){
	for(tab of document.getElementsByClassName('tab_content')){
		tab.style.display= "none";
		
	}
	
	document.getElementById(id).style.display= "block";
}

//return a dict from id to content
function readForm(form_id){
	let entries= {};
	
	for(let entry of document.getElementById(form_id)){
		if(entry.id){
			entries[entry.id]= entry.value;
		}
	}
	
	return entries;
}

//register the rsvp form submit
document.getElementById('rsvp_form').onsubmit= function(){
	let entries= readForm('rsvp_form');
	
	const data= {
		first_name: entries.first_name_input,
		last_name: entries.last_name_input
	}
	
	$.ajax({
		url: "/get_invite_info",
		method: "GET",
		
		data: data,
		
		success: function(response){
			console.log(response);
		}
	});
	
	//prevent refresh
	return false;
};

changeTab('rsvp_tab');
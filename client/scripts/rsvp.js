const contentIds= ['group_search', 'rsvp_form'];

//switch content to the given id
// function switchContent(id){
	// for(contentId of contentIds){
		// document.getElementById(contentId).display= 'none';
	// }
	
	// document.getElementById(id).display= 'block';
// }

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

//recieve input and layout page accordingly
document.getElementById('search_form').onsubmit= function(){
	let input= readForm('search_form');
		
	const data= {
		input: input
	}
	
	$.ajax({
		url: "/get_invite_info",
		method: "GET",
		
		data: data,
		
		success: function(response){
			layoutSearchResult(response);
		}
	});
	
	//prevent reload
	return false;
}



function layoutSearchResult(groups){
	let groupsDiv= groups.map(groupDiv).reduce((div1, div2) => div1 + div2);
	
	document.getElementById('result').innerHTML= `<div>${groupsDiv}</div>`;
}

//create a div for the given group
function groupDiv(group){
	//convert each member to a string and join with &
	let group_string= group.members.map(memberName).join(' & ');
	
	return `
		<div onclick="groupSelected(${group.id})" class="group_button">
			<span>${group_string}</span>
		</div>
	`;
}

function memberName(member){
	return `${member.firstName} ${member.lastName}`;
}

//handle a group being chosen
function groupSelected(groupId){
	const data= {
		groupId: groupId
	}
	
	$.ajax({
		url: "/get_group",
		method: "GET",
		
		data: data,
		
		success: function(response){
			layoutPeople(response);
		}
	});
}

function layoutPeople(group){
	document.getElementById('rsvp_form').innerHtml= "";
}
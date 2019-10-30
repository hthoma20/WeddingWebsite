const contentIds= ['group_search', 'rsvp_form'];

switchContent('group_search');

//switch content to the given id
function switchContent(id){
	for(contentId of contentIds){
		document.getElementById(contentId).style.display= 'none';
	}
	
	document.getElementById(id).style.display= 'block';
}

//return a dict from id to content
function readForm(form_id){
	let entries= {};
	
	for(let entry of document.getElementById(form_id)){
		if(entry.id){
			if(entry.type == 'checkbox'){
				entries[entry.id]= entry.checked;
			}
			else{				
				entries[entry.id]= entry.value;
			}
		}
	}
	
	return entries;
}

//recieve input and layout page accordingly
document.getElementById('search_form').onsubmit= function(){
	let input= readForm('search_form');
		
	const data= {
		input: input.name_input
	}
	
	document.getElementById('result').innerHTML= `<div>Searching...</div>`;
	
	$.ajax({
		url: "/get_invite_info",
		method: "GET",
		
		data: data,
		
		success: function(response){
			layoutSearchResult(response);
		},
		
		error: function(err){
			console.log(err.status, err.responseJSON);
			if(err.status == 400){
				layoutSearchError(err.responseJSON);
			}
		}
	});
	
	//prevent reload
	return false;
}

function layoutSearchError(badWordsList){
	document.getElementById('result').innerHTML= 
		`<div>
			Search cannot include:<br>
			${badWordsList.join(', ')}
		</div>`;
}

function layoutSearchResult(groups){
	if(groups.length < 1){
		document.getElementById('result').innerHTML= `<div>No results found</div>`;
		return;
	}
	
	let groupsDiv= document.createElement('div');
	for(let group of groups){
		groupsDiv.appendChild(groupDiv(group));
	}
	
	let resultNode= document.getElementById('result');
	removeAllChildren(resultNode);
	resultNode.append(groupsDiv);
}

//create a div for the given group
function groupDiv(group){
	//convert each member to a string and join with &
	let group_string= group.members.map(memberName).join(' & ');
	
	let div= document.createElement('div');
	
	div.className= 'group_button';
	div.onclick= () => groupSelected(group);
	div.innerHTML= `<span>${group_string}<\span>`;
	
	return div;
}

function memberName(member){
	return member.is_guest ? 'Guest' : `${member.first_name} ${member.last_name}`;
}

//handle a group being chosen
function groupSelected(group){
	layoutPeople(group);
	switchContent('rsvp_form');
}

function layoutPeople(group){
	let rsvpTable= document.getElementById('rsvp_table');
	removeAllRows(rsvpTable);
	
	for(let i= 0; i < group.members.length; i++){
		let row= rsvpTable.insertRow(i+1);
		populateMemberRow(row, group.members[i]);
	}
}

//insert the correct data into the the given table row
function populateMemberRow(row, member){
	let nameCell= row.insertCell(0);
	let receptionCell= row.insertCell(1);
	let ceremonyCell= row.insertCell(2);
	
	nameCell.innerHTML= `${memberName(member)}`;
	
	if(member.reception){
		let checked= member.attending_reception ? 'checked' : '';
		receptionCell.innerHTML= `<input id="attending_reception#${member.guest_id}" type="checkbox" ${checked}">`;
	}
	if(member.ceremony){
		let checked= member.attending_ceremony ? 'checked' : '';
		ceremonyCell.innerHTML= `<input id="attending_ceremony#${member.guest_id}" type="checkbox" ${checked}">`;
	}
}

function rsvpSubmitted(){
	let rsvpResults= readForm('rsvp_form');
	
	//map from guest_id to attendence
	let data= {};
	
	for(let key in rsvpResults){
		let pair= key.split('#');
		let guest_id= pair[1];
		let field= pair[0];
		
		if(!data[guest_id]){
			data[guest_id] = {};
		}
		
		data[guest_id][field]= rsvpResults[key];
	}
	
	console.log(data);
	
	//send to server
	$.ajax({
		url: "/update_rsvp",
		method: "POST",
		contentType: "application/json",
		
		data: JSON.stringify(data),
		
		success: function(response){
			console.log(response);
		},
		
		error: function(err){
			console.log(err.status, err.responseJSON);
		}
	});
}

//remove all but the header row from a table
function removeAllRows(table){
	while(table.rows.length > 1){
		table.deleteRow(1);
	}
}

function removeAllChildren(element){
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}
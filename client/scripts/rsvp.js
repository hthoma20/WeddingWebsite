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
			console.log(entry.id);
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
	
	if(group.group_id == 14){
		group_string= "The Kortenhof Family";
	}
	
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
	
	removeBadColumns(group);
	
	for(let i= 0; i < group.members.length; i++){
		let row= rsvpTable.insertRow(i+1);
		populateMemberRow(row, group.members[i]);
	}
}

//remove the headers if no group memebers are invited
function removeBadColumns(group){
	let hasHawaii= false;
	let hasPortland= false;
	
	for(member of group.members){
		if(member.reception){
			hasHawaii= true;
		}
		if(member.ceremony){
			hasPortland= true;
		}
	}
	
	if(!hasHawaii){
		document.getElementById('hawaii_header').style.display= 'none';
	}
	if(!hasPortland){
		document.getElementById('portland_header').style.display= 'none';
	}
}

//insert the correct data into the the given table row
function populateMemberRow(row, member){
	let nameCell= row.insertCell(0);
	let ceremonyCell= row.insertCell(1);
	let receptionCell= row.insertCell(2);
	
	nameCell.innerHTML= `${memberName(member)}`;
	
	if(member.reception){
		let buttonId= `attending_reception#${member.guest_id}`;
		receptionCell.appendChild(createRsvpButton(buttonId, member.attending_reception));
	}
	if(member.ceremony){
		let buttonId= `attending_ceremony#${member.guest_id}`;
		ceremonyCell.appendChild(createRsvpButton(buttonId, member.attending_ceremony));
	}
}

//create the rspv button given the id and the value they have already marked
function createRsvpButton(id, attending){
	let yes= document.createElement('span');
	let no = document.createElement('span');
	
	yes.innerHTML= 'Yes';
	no.innerHTML= 'No';
	
	yes.classList.add('yes_no');
	yes.classList.add('yes');
	no.classList.add('yes_no');
	no.classList.add('no');
	
	if(attending == 0){
		no.classList.add('selected');
	}
	else if(attending == 1){
		yes.classList.add('selected');
	}
	
	yes.onclick= function(){
		yes.classList.add('selected');
		no.classList.remove('selected');
	}
	
	no.onclick= function(){
		no.classList.add('selected');
		yes.classList.remove('selected');
	}
	
	
	let rsvp= document.createElement('span');	
	rsvp.id= id;
	rsvp.className= 'rsvp_button';
	rsvp.appendChild(yes);
	rsvp.appendChild(no);
	return rsvp;
}

//return a map from span id (attending_{party}#{guest_id}) to whether they're attending
function readRsvp(){
	let buttons= document.getElementsByClassName('rsvp_button');
	
	let results= {};
	
	for(b of buttons){
		let selected= b.getElementsByClassName('selected');
		
		//nothing selected;
		if(selected.length == 0) continue;
		
		//yes selected
		if(selected[0].classList.contains('yes')){
			results[b.id]= true;
		}
		else{ //no selected
			results[b.id]= false;
		}
	}
	
	return results;
}

function rsvpSubmitted(){
	let rsvpResults= readRsvp();
	
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
	
	let resultDiv= document.getElementById('send_rsvp');
	resultDiv.innerHTML= '';
	
	//send to server
	$.ajax({
		url: "/update_rsvp",
		method: "POST",
		contentType: "application/json",
		
		data: JSON.stringify(data),
		
		success: function(response){
			console.log(response);
			resultDiv.innerHTML= "Your RSVP has been recieved";
		},
		
		error: function(err){
			console.log(err.status, err.responseJSON);
			resultDiv.innerHTML= "There was an error processing your RSVP, please try again";
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
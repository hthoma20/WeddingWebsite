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

document.getElementById('song_form').onsubmit= function(){
	songInfo = readForm('song_form');
	
	console.log(songInfo);
	
	const data= {
		Title: songInfo.title_input,
		Artist: songInfo.artist_input
	}
	
	console.log(JSON.stringify(data));
	
	$.ajax({
		url: "/add_song",
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
	
	//prevent form from sending and reloading page
	return false;
}
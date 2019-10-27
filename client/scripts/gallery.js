//get a list of all photos in the gallery
const galleryPhotos= document.getElementById('gallery_content').getElementsByTagName('img');

const slideshowNode= document.getElementById('slideshow');
const currentPhotoNode= document.getElementById('current_photo');

//register a click event to each image
for(let i= 0; i < galleryPhotos.length; i++){
	galleryPhotos[i].onclick= () => imageClicked(i);
}

//the index of the image in the array that we are currently viewing
var slideId= -1;


//clear any photos from the current photo
function clearPhoto(){
	for(photo of currentPhotoNode.children){
		console.log("removing ", photo);
		currentPhotoNode.removeChild(photo);
	}
}

//show and hide the slideshow by passing a boolean
function slideshowVisible(visible){
	slideshowNode.className= visible ? '' : 'hidden';
}

function stopSlideShow(){	
	clearPhoto();
	slideshowVisible(false);
	slideId= -1;
}

function changeSlide(imageId){
	//remove the current photo
	clearPhoto();
	
	//add the photo
	currentPhotoNode.appendChild(galleryPhotos[imageId].cloneNode());
	
	//update the current photo id
	slideId= imageId;
	
	//set the slideshow visible
	slideshowVisible(true);
}

function imageClicked(imageId){
	if(imageId === slideId){
		stopSlideShow();
		return;
	}
	
	changeSlide(imageId);
}

function scrollLefty(){
	//set the new slide if its not the first slide
	let newslide= Math.max(0, slideId-1);
	changeSlide(newslide);
}

function scrollRighty(){
	//set the new slide if its not the last slide
	let newslide= Math.min(galleryPhotos.length-1, slideId+1);
	changeSlide(newslide);
}

window.onkeydown= function(keyevent){
	let key= keyevent.key;
	
	if(key == 'Escape'){
		stopSlideShow();
	}
	else if(key == 'ArrowRight'){
		scrollRighty();
	}
	else if(key == 'ArrowLeft'){
		scrollLefty();
	}
}
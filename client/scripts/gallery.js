//get a list of all photos in the gallery
const galleryPhotos= document.getElementById('gallery_content').getElementsByTagName('img');

//register a click event to each image
for(let i= 0; i < galleryPhotos.length; i++){
	galleryPhotos[i].onclick= () => imageClicked(i);
}

//the index of the image in the array that we are currently viewing
var slideId= -1;

function stopSlideShow(){
	//the slideshow is already stopped
	if(slideId === -1){
		return;
	}
	
	galleryPhotos[slideId].classList.remove('selected');
	slideId= -1;
}

function changeSlide(imageId){
	if(slideId !== -1){
		galleryPhotos[slideId].classList.remove('selected');
	}
	
	galleryPhotos[imageId].classList.add('selected');
	slideId= imageId;
}

function imageClicked(imageId){
	if(imageId === slideId){
		stopSlideShow();
		return;
	}
	
	changeSlide(imageId);
}

window.onkeydown= function(keyevent){
	let key= keyevent.key;
	
	if(key == 'Escape'){
		stopSlideShow();
	}
	else if(key == 'ArrowRight'){
		//set the new slide if its not the last slide
		let newslide= Math.min(galleryPhotos.length-1, slideId+1);
		changeSlide(newslide);
	}
	else if(key == 'ArrowLeft'){
		//set the new slide if its not the first slide
		let newslide= Math.max(0, slideId-1);
		changeSlide(newslide);
	}
}
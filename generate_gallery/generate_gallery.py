import os
from PIL import Image
import random

RANDOMIZE= True

def createImageTag(imageName, imageId):
    if isVertical(imageName):
        orientation= 'vertical'
    else:
        orientation= 'horizontal'
    
    return '<img src="./images/gallery/{}" id="{}" class="gallery_photo {}"/>'.format(imageName, imageId, orientation)
    
def isVertical(imageName):
    image= Image.open('../client/images/gallery/{}'.format(imageName))
    
    width, height= image.size
    
    return height > width
    
def getGalleryImages():
    files= os.listdir('../client/images/gallery')
    
    imageFiles= filter(isImageFile, files)
    
    imageFilesList= list(imageFiles)
    
    if RANDOMIZE:
        random.shuffle(imageFilesList)
    
    return imageFilesList
    
def isImageFile(fileName):
    endings= ['.jpg','.JPG','.png','.PNG']
    
    for ending in endings:
        if fileName.endswith(ending):
            return True
            
    return False

#return a string with the entire html to insert    
def createImagesHTML():
    html= ''
    
    idNum= 0
    for imageFile in getGalleryImages():
        id= 'photo_{}'.format(idNum)
       
        html+= '\t\t\t{}\n'.format(createImageTag(imageFile, id))
        
        idNum+= 1
    
    return html+'\n'

if __name__ == '__main__':
    with open('./gallery_template.html', 'r') as template, open('../client/gallery.html', 'w') as final:
        for line in template:
            final.write(line)
            
            if 'id="gallery_content"' in line:
                final.write(createImagesHTML())
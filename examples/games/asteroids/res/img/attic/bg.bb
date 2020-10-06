Graphics 640,480,32,2

img=LoadImage ("bg1.png")
buf=ImageBuffer(img)

w=ImageWidth(img)
h=ImageHeight(img)

scaledown("bg1.png", "stars1.bmp")

Function scaledown(filename$, filename2$)
	
	img=LoadImage(filename$);

	If(ImageWidth(img)>=640) Then 
	
		ScaleImage img,0.25,0.25 
		
		img2=CreateImage (320,120)
		
		SetBuffer ImageBuffer(img2)
		DrawBlock img,0,0
		DrawBlock img,160,0
	
		
		SaveImage img2,filename2$
     EndIf 

	
End Function


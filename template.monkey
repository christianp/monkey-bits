Import mojo

Extern
	Function realTime()="(new Date()).getTime"
Public

Class xApp Extends App
	Field screenMatrix#[]
	Field mx#,my#

	Method OnCreate()
		Seed = realT
		SetUpdateRate 60
		
		PushMatrix
			Translate DeviceWidth/2,DeviceHeight/2		
			Scale DeviceWidth()/400.0,DeviceHeight()/300.0
			screenMatrix = GetMatrix()
		PopMatrix
		
	End
	
	Method OnUpdate()
		PushMatrix
			SetMatrix screenMatrix
			Local mouse#[]=InvTransform([MouseX(),MouseY()])
			mx=mouse[0]
			my=mouse[1]
		
		PopMatrix
	End
	
	Method OnRender()
		Cls

		SetColor 255,255,255
		
		PushMatrix
			SetMatrix screenMatrix
		
		PopMatrix
	End
End

Function Main()
	New xApp
End

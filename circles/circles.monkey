Import mojo

Const speed#=10

Global incentre#=1/Sqrt(3)
Global t60#=Tan(60), t30#=Tan(30)
Global diff#=(t60-incentre*2)

Global curchannel=0
Function cpPlaySound(s:Sound)
	PlaySound s,curchannel
	curchannel = (curchannel+1) Mod 32
End

Function inscreen(points#[])
	points = Transform(points)
	Local minx#=641,miny#=481,maxx#=-1,maxy#=-1
	For Local i=0 To points.Length-1 Step 2
		If points[i]<minx minx=points[i]
		If points[i]>maxx maxx=points[i]
		If points[i+1]<miny miny=points[i+1]
		If points[i+1]>maxy maxy=points[i+1]
	Next
	Return Abs(maxx-minx)>1 And Abs(maxy-miny)>1 And(minx<640 And maxx>0) And (miny<480 And maxy>0)
End

Function tricol#[](x#,y#)
	Local lambda# = y/Sin(60)
	Local mu# = x-lambda*Cos(60)
	Return tricol2(lambda,mu)
End

Function tricol2#[](lambda#,mu#)
	If lambda<0 lambda=0
	If mu<0 mu=0
	If lambda+mu>1
		lambda /= (lambda+mu)
		mu /= (lambda+mu)
	Endif
	Return [lambda,mu,1-lambda-mu]
End

Class Node
	Field r#,g#,b#
	
	Field split:Bool
	Field ready
	Field m:Node,ur:Node,top:Node,br:Node
	Field mode=0
	
	Global pops:Sound[3]
	
	Method New(col#[])
		r=Rnd(255)
		g=Rnd(255-r)
		b=Rnd(255-(r+g))
		ready=speed
		
		r=col[0]
		g=col[1]
		b=col[2]
	End
	
	Method Split()
		split=True
		cpPlaySound Node.pops[Int(Rnd(0,2))]
		
		Local x# = r*Cos(60)+g 
		Local y# = r*Sin(60) 
		
		Local f#
		If r=.5 And g=.5
			f=.5
		Else
			f=.1
		Endif
		
		m=New Node([r,g,b])
		ur=New Node(tricol2(r+(1-r)*f,g))
		top=New Node(tricol2(r,g+(1-g)*f))
		br=New Node(tricol2(r-r*f,g-g*f))

		ready=speed
	End
	
	Method GetNode:Node(x#,y#)
		Local mouse#[]=InvTransform([x,y])
		Local mx#=mouse[0]
		Local my#=mouse[1]
		
		If my<0 Or my>t60 Return Null
		
		If Abs(mx)>(t60 - my)*t30 Return Null
		
		Local n:Node=Null,r:Node=Null
		If split
				PushMatrix
					Translate 0,incentre
					Scale .5,.5
					Translate 0,diff
					Rotate 180
					n=m.GetNode(x,y)
				PopMatrix
				If n 
					r=n
				Else
					PushMatrix
						Translate 0,incentre
						Scale .5,.5
						Translate 0,diff
						n=top.GetNode(x,y)
					PopMatrix
					If n 
						r=n
					Else
						PushMatrix
							Translate 0,incentre
							Scale .5,.5
							Rotate 120
							Translate 0,diff
							n=ur.GetNode(x,y)
						PopMatrix
						If n
							r=n
						Else
							PushMatrix
								Translate 0,incentre
								Scale .5,.5
								Rotate 240
								Translate 0,diff
								n=br.GetNode(x,y)
							PopMatrix
							If n r=n
						Endif
					Endif
				Endif
			Return r
		Else
			my -= incentre
			If mx*mx+my*my<=incentre*incentre
				Return Self
			Endif
		Endif
	End
	
	Method Update()
		Select mode
		Case 0
			If ready>0
				ready -=1
			Else
				If split And Not (m.split Or top.split Or br.split Or ur.split) And Rnd(800)<=1
					mode=1
				Endif
			Endif
		Case 1
			ready +=1
			If ready=speed
				split=False
				cpPlaySound Node.pops[2]
				mode=0
				ready=0
			Endif
		End
		If split
			m.Update
			ur.Update
			top.Update
			br.Update
		Endif
	End
	
	Method Draw()
		If Not inscreen([-1.0,0.0,1.0,0.0,0.0,t60]) Return
		SetColor r*255,g*255,b*255
		
		If split
			Local f#=1-ready/speed
			PushMatrix
				SetAlpha 1-f
				DrawCircle 0,incentre,(1-f)*incentre
				
				Local d#=diff*f

				SetAlpha f
				Translate 0,incentre
				Scale .5,.5
				PushMatrix
					Translate 0,d
					Rotate 180
					m.Draw
				PopMatrix
				PushMatrix
					Translate 0,d
					top.Draw
				PopMatrix
				PushMatrix
					Rotate 120
					Translate 0,d
					ur.Draw
				PopMatrix
				PushMatrix
					Rotate 240
					Translate 0,d
					br.Draw
				PopMatrix
			PopMatrix
		Else
			SetAlpha 1
			DrawCircle 0,incentre,incentre
		Endif
	End
End

Class CirclesApp Extends App
	Field screenMatrix#[]
	
	Field mx#,my#
	Field ox#,oy#
	
	Field base:Node
	Field last:Node
	Field sacc#=1,tacc#=0

	Method OnCreate()
	
		For Local i=0 To 2
			Node.pops[i]=LoadSound("pop"+(i+1)+".ogg")
		Next
	
		SetUpdateRate 60
		
		PushMatrix
		Translate DeviceWidth/2,0
		Rotate 180
		Scale DeviceHeight()/(2*Sin(60)),DeviceHeight()/(2*Sin(60))
		Translate 0,-t60
		screenMatrix = GetMatrix()
		PopMatrix
		
		Seed=Millisecs()
		
		base=New Node([.5,.5,.5])
		
	End
	
	Method OnUpdate()
		mx = MouseX()
		my = MouseY()
		
		PushMatrix
		SetMatrix screenMatrix
		
		Local mouse#[]=InvTransform([mx,my])
		If TouchDown(0)
			Translate (mouse[0]-ox),(mouse[1]-oy)
			screenMatrix = GetMatrix
		Endif
		
		Local t#=(KeyDown(KEY_RIGHT)-KeyDown(KEY_LEFT))
		If t<>0
			tacc+=(1-tacc)*.01
			Translate mouse[0],mouse[1]
			Rotate tacc*t*15
			Translate -mouse[0],-mouse[1]
			screenMatrix = GetMatrix
		Else
			tacc=0
		Endif
		
		Local s# = 1+(KeyDown(KEY_UP) - KeyDown(KEY_DOWN))*.01
		If s<>1
			sacc+=(s-1)*.1
			Translate mouse[0],mouse[1]
			Scale sacc,sacc
			Translate -mouse[0],-mouse[1]
			screenMatrix = GetMatrix
		Else
			sacc=1
		Endif
			

		mouse=InvTransform([mx,my])
		ox=mouse[0]
		oy=mouse[1]

		Local n:Node=base.GetNode(mx,my)
		
		If n And n.ready=0 And n<>last
			n.Split
			last=base.GetNode(mx,my)
		Endif
		
			last = n
		
		base.Update
		
		PopMatrix
	End
	
	Method OnRender()
		Cls 255,255,255

		SetColor 0,0,0
		
		PushMatrix
		SetMatrix screenMatrix
		
		base.Draw
		
		PopMatrix
	End
End

Function Main()
	New CirclesApp
End


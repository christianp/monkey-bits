Import mojo

Import cp.geometry

Const gravity#=1

Class Item
	Global all:=New List<Item>
	
	Method New()
		Item.all.AddLast Self
	End
	
	Function UpdateAll()
		For Local i:=Eachin Item.all
			i.Update
		Next
	End
	
	Function DrawAll()
		For Local i:=Eachin Item.all
			i.Draw
		Next
	End
	
	Method Update()
	End
	
	Method Draw() Abstract
End

Class Stick Extends Item
	Field v1:Vertex
	Field v2:Vertex
	
	Method New(x1#,y1#,x2#,y2#,w1#=1,w2#=1)
		v1=New Vertex(x1,y1,w1)
		v2=New Vertex(x2,y2,w2)
		
		MakeConstraint
	End

	Method New(_v1:Vertex,x2#,y2#,w2#=1)
		v1=_v1
		v2=New Vertex(x2,y2,w2)
		
		MakeConstraint
	End
	
	Method New(_v1:Vertex,_v2:Vertex)
		v1=_v1
		v2=_v2
		
		MakeConstraint
	End
	
	Method MakeConstraint()
		Local dx#=v2.x-v1.x
		Local dy#=v2.y-v1.y
		Local d#=Sqrt(dx*dx+dy*dy)
		
		New LengthConstraint(v1,v2,d,Constraint.gstiff)
	End
	
	Method Draw()
		PushMatrix
			SetColor 0,150,0
			Translate v1.x,v1.y
			Rotate -ATan2(v2.y-v1.y,v2.x-v1.x)
			DrawRect 0,-5,distance(v1,v2),10
		PopMatrix
		DrawLine v1.x,v1.y,v2.x,v2.y
	End
End

Class Thread Extends Item
	Field v1:Vertex,v2:Vertex
	Field links,verts:Vertex[]
	
	Method New(_v1:Vertex,_v2:Vertex,_links=5)
		v1=_v1
		v2=_v2
		links=_links
		
		MakeConstraint
	End
	
	Method New(x1#,y1#,x2#,y2#,w1#=1,w2#=1,_links=5)
		v1=New Vertex(x1,y1,w1)
		v2=New Vertex(x2,y2,w2)
		links=_links
		
		MakeConstraint
	End

	Method New(_v1:Vertex,x2#,y2#,w2#=1,_links=5)
		v1=_v1
		v2=New Vertex(x2,y2,w2)
		links=_links
		
		MakeConstraint
	End
		
	Method MakeConstraint()
		verts = New Vertex[links+1]
		Local dx#=(v2.x-v1.x)/links
		Local dy#=(v2.y-v1.y)/links
		
		verts[0]=v1
		verts[links]=v2
		
		Local v:Vertex=v1
		For Local i=1 To links-1
			verts[i]=New Vertex(v1.x+i*dx,v1.y+i*dy,.1)
			New LengthConstraint(v,verts[i])
			v=verts[i]
		Next
		New LengthConstraint(v,v2)
	End
	
	Method Draw()	
		SetColor 255,255,255
		For Local i=0 To links-1
			DrawLine verts[i].x,verts[i].y,verts[i+1].x,verts[i+1].y
		Next
	End
End

Class Ball Extends Item
	Field v:Vertex
	Field r,g,b
	
	Method New(_v:Vertex)
		v=_v
	'	v.weight+=10
		
		r=Rnd(255)
		g=Rnd(255-r)
		b=Rnd(255-r-g)
	End
	
	Method Draw()
		SetColor r,g,b
		DrawCircle v.x,v.y,10
	End
End

Class Vertex
	Global all:=New List<Vertex>
	
	Field ox#,oy#,nx#,ny#,x#,y#
	Field vx#,vy#
	Field weight#
	
	Method New(_x#,_y#,_weight#=1)
		Vertex.all.AddLast Self
		
		x=_x
		ox=_x
		y=_y
		oy=_y
		
		weight = _weight
	End
	
	Function UpdateAll()
		For Local v:=Eachin Vertex.all
			v.Update
		Next
	End
	
	Method Update()
		vx=x-ox
		vy=y-oy
		ox=x
		oy=y
		x+=vx
		y+=vy+gravity
		
		nx=0
		ny=0
	End
End

Function distance#(v1:Vertex,v2:Vertex)
	Return geometry.distance(v1.x,v1.y,v2.x,v2.y)
End

Class Constraint
	Global all:=New List<Constraint>
	Field stiffness#=1
	Const gstiff#=1
	Global solveIterations=100
	
	Method New()
		Constraint.all.AddLast Self
	End
	
	Function SatisfyAll()
		For Local i=1 To solveIterations
			For Local v:=Eachin Vertex.all
				v.x+=v.nx
				v.y+=v.ny
				v.nx=0
				v.ny=0
			Next
			
			For Local c:=Eachin Constraint.all
				c.Satisfy()
			Next
		Next
	End
	
	Method MoveVertex(v:Vertex,dx#,dy#)
		v.nx += dx*stiffness
		v.ny += dy*stiffness
	End

	Method Satisfy() Abstract
End

Class LengthConstraint Extends Constraint
	Field v1:Vertex,v2:Vertex
	Field length#
	
	Method New(_v1:Vertex,_v2:Vertex,_length#=-1,_stiffness#=-1)
		v1=_v1
		v2=_v2
		If _length=-1
			length=distance(v1,v2)
		Else
			length=_length
		Endif
		If _stiffness=-1
			stiffness=Constraint.gstiff
		Else
			stiffness=_stiffness
		Endif
	End
	
	Method Satisfy()
		Local dx#=v2.x-v1.x
		Local dy#=v2.y-v1.y
		Local d#=Sqrt(dx*dx+dy*dy)
		Local f#=(d-length)/2
		
		Local w1#=1/v1.weight
		Local w2#=1/v2.weight
		Local w#=w1/(w1+w2)
		
		dx /= d
		dy /= d
		
		MoveVertex v1, f*dx*w, f*dy*w
		MoveVertex v2, -f*dx*(1-w), -f*dy*(1-w)
	End
End

Class PivotConstraint Extends Constraint
	Field v1:Vertex,v2:Vertex, v3:Vertex
	
	Method New(_v1:Vertex,_v2:Vertex,_v3:Vertex,_stiffness#=1)
		v1=_v1
		v2=_v2
		v3=_v3
		stiffness=_stiffness
		
		Local l1#=distance(v1,v2)
		Local l2#=distance(v3,v2)
		
		New LengthConstraint(v1,v2,l1,stiffness)
		New LengthConstraint(v2,v3,l2,stiffness)
	End
	
	Method Satisfy()
		'Local d#=pointlinedistance(v2.x,v2.y,v1.x,v1.y,v3.x,v3.y)
		'Local an#=ATan2(v3.y-v1.y,v3.x-v1.x)
		'Local dx#=Cos(an+90)
		'Local dy#=Sin(an+90)
		
		'MoveVertex v2, dx*d/2, dy*d/2
		'MoveVertex v1, -dx*d/2, -dy*d/2
		'MoveVertex v3, -dx*d/2, -dy*d/2
	End
End

Class SwingApp Extends App
	Field screenMatrix#[]
	Field mx#,my#
	
	Field top:Vertex

	Method OnCreate()
		SetUpdateRate 60
		
		PushMatrix
		Translate DeviceWidth/2,DeviceHeight/2		
		Scale DeviceWidth()/400.0,DeviceHeight()/300.0
		screenMatrix = GetMatrix()
		PopMatrix
		
		Local thread1:=New Thread(0,0,0,100,1,1,10)
		top = thread1.v1
		
		Local stick2:=New Stick(-50,100,50,100)
		New PivotConstraint(stick2.v1,thread1.v2,stick2.v2,Constraint.gstiff)
		
		Local thread2:=New Thread(stick2.v1,-50,200)
		
		Local thread3:=New Thread(stick2.v2,50,150)
		
		New Ball(thread2.v2)
		New Ball(thread3.v2)
	End
	
	Method OnUpdate()
		PushMatrix
		SetMatrix screenMatrix
		Local mouse#[]=InvTransform([MouseX(),MouseY()])
		mx=mouse[0]
		my=mouse[1]
		
		Vertex.UpdateAll
		
		Constraint.SatisfyAll
		
		Item.UpdateAll
		
		top.x=mx
		top.y=my
		
		
		PopMatrix
	End
	
	Method OnRender()
		Cls

		SetColor 255,255,255
		
		PushMatrix
		SetMatrix screenMatrix
		
		Item.DrawAll
		
		'For Local v:=Eachin Vertex.all
		'	DrawCircle v.x,v.y,5
		'Next
		
		PopMatrix
	End
End

Function Main()
	New SwingApp
End


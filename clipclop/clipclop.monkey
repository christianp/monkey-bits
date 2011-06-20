Import mojo

Class Horse
	Field joints:List<Joint>
	Field bones:List<Bone>
	Field constraints:List<Constraint>
	
	Field hoof:Joint[4],centre:Joint
	
	Field uphoof,hx#,hy#
	
	Field x#,y#
	Field size#
	
	Method New(_x#,_y#,_size#=40)
		x=_x
		y=_y
		size=_size
	
		joints = New List<Joint>
		bones = New List<Bone>
		constraints = New List<Constraint>
		
		hoof[3]=addJoint(New Joint(0.5*size,1*size))
		Local rbknee:=addJoint(New Joint(0.5*size,1*size))
		Local rhip:=addJoint(New Joint(0.5*size,1*size))
		hoof[2]=addJoint(New Joint(-0.5*size,1*size))
		Local lbknee:=addJoint(New Joint(-0.5*size,1*size))
		Local lhip:=addJoint(New Joint(-0.5*size,1*size))
		Local pelvis:=addJoint(New Joint(0,1*size))
		hoof[1]=addJoint(New Joint(0.5*size,-1*size))
		Local rfknee:=addJoint(New Joint(0.5*size,-1*size))
		Local rshoulder:=addJoint(New Joint(0.5*size,-1*size))
		hoof[0]=addJoint(New Joint(-0.5*size,-1*size))
		Local lfknee:=addJoint(New Joint(-0.5*size,-1*size))
		Local lshoulder:=addJoint(New Joint(-0.5*size,-1*size))
		Local collar:=addJoint(New Joint(0,-1*size))
		centre=addJoint(New Joint(0,0))
		
		addBone(New Bone(centre,collar,-1,-1))
		addBone(New Bone(collar,lshoulder,-1,-1))
		addBone(New Bone(lshoulder,lfknee,.5*size,0))
		addBone(New Bone(lfknee,hoof[0],.5*size,0))
		addBone(New Bone(collar,rshoulder,-1,-1))
		addBone(New Bone(rshoulder,rfknee,.5*size,0))
		addBone(New Bone(rfknee,hoof[1],.5*size,0))
		addBone(New Bone(centre,pelvis,-1,-1))
		addBone(New Bone(pelvis,lhip,-1,-1))
		addBone(New Bone(lhip,lbknee,.5*size,0))
		addBone(New Bone(lbknee,hoof[2],.5*size,0))
		addBone(New Bone(pelvis,rhip,-1,-1))
		addBone(New Bone(rhip,rbknee,.5*size,0))
		addBone(New Bone(rbknee,hoof[3],.5*size,0))
		
		addBone(New Bone(hoof[0],collar,.1,0,0.1))
		addBone(New Bone(hoof[1],collar,.1,0,0.1))
		addBone(New Bone(hoof[2],pelvis,.1,0,0.1))
		addBone(New Bone(hoof[3],pelvis,.1,0,0.1))
		
		addHinge(New Hinge(lshoulder,lfknee,hoof[0],180,10,.1,.01))
		addHinge(New Hinge(rshoulder,rfknee,hoof[1],180,.1,.01))
		addHinge(New Hinge(lhip,lbknee,hoof[2],180,.1,.01))
		addHinge(New Hinge(rhip,rbknee,hoof[3],180,.1,.01))
		
		addHinge(New Hinge(lshoulder,collar,rshoulder,180,10))
		addHinge(New Hinge(lhip,pelvis,rhip,180,10))
		addHinge(New Hinge(lshoulder,collar,centre,90,30,.1,.01))
		addHinge(New Hinge(rshoulder,collar,centre,-90,30,.1,.01))
		addHinge(New Hinge(lhip,pelvis,centre,-90,30,.1,.01))
		addHinge(New Hinge(rhip,pelvis,centre,90,30,.1,.01))
		
		addHinge(New Hinge(collar,centre,pelvis,180,0,.01,.01))
		
		For Local i=0 To 3
			hoof[i].fixed=True
		Next
		
		hx=hoof[0].x
		hy=hoof[0].y
		
	End
	
	Method addJoint:Joint(j:Joint)
		joints.AddLast j
		Return j
	End
	
	Method addBone:Bone(b:Bone)
		constraints.AddLast b
		bones.AddLast b
		Return b
	End
	
	Method addHinge:Hinge(h:Hinge)
		constraints.AddLast h
		Return h
	End	

	Method satisfy()
		Local j:Joint,c:Constraint
		
		For Local i=1 To 10
			For j=Eachin joints
				j.ox=j.x
				j.oy=j.y
			Next
			
			For c=Eachin constraints
				c.satisfy
			Next
		Next
		
		Local dx#=centre.x
		Local dy#=centre.y
		x+=dx
		y+=dy
		
		For j=Eachin joints
			j.x-=dx
			j.y-=dy
		Next
	End
	
	Method Update(tx#,ty#)
		Local stepsize#=15
		Local d#,f#,dx#,dy#
		Local an#
		dx=hx-hoof[uphoof].x-x
		dy=hy-hoof[uphoof].y-y
		
		If dx*dx+dy*dy<1
			uphoof = (uphoof+1) Mod 4
			
			an=ATan2(ty-y,tx-x)
			an=0
			
			tx+=Cos(an+90*uphoof-135)*size
			ty+=Sin(an+90*uphoof-135)*size*1.5
			
			dx=tx-hoof[uphoof].x-x
			dy=ty-hoof[uphoof].y-y
			d=Sqrt(dx*dx+dy*dy)
			f=Min(stepsize,d)
			hx=hoof[uphoof].x+x+dx*f/d
			hy=hoof[uphoof].y+y+dy*f/d
		Endif

		dx=hx-hoof[uphoof].x-x
		dy=hy-hoof[uphoof].y-y
		
		d=Sqrt(dx*dx+dy*dy)
		f=Min(d,3.0)
		hoof[uphoof].x += f*dx/d
		hoof[uphoof].y += f*dy/d
	End
	
	Method Draw()
		PushMatrix
		PushMatrix
		Translate x,y
		
		For Local b:Bone=Eachin bones
			b.Draw
		Next
		For Local j:=Eachin joints
			j.Draw
		Next
		
		PopMatrix
		
		DrawRect hx,hy,3,3
	End
	
End

Class Joint
	Field x#,y#
	Field fixed
	Field ox#,oy#
	
	Method New(_x#,_y#)
		x=_x
		y=_y
		ox=x
		oy=y
	End
	
	Method Draw()
		DrawCircle x,y,3
	End
End

Class Constraint
	Method satisfy() Abstract
End

Class Bone Extends Constraint
	Field maxlength#,minlength#,force#
	Field j1:Joint, j2:Joint
	Field code
	
	Method New(_j1:Joint,_j2:Joint,_maxlength#=0,_minlength#=0,_force#=.9)
		j1=_j1
		j2=_j2
		maxlength=_maxlength
		minlength=_minlength
		force=_force

		If maxlength=-1
			Local dx#=j2.x-j1.x
			Local dy#=j2.y-j1.y
			maxlength=Sqrt(dx*dx+dy*dy)
		Endif
		If minlength=-1 
			minlength=maxlength 
		Endif
	End
	
	Method satisfy()
		code=0
		
		If j1.fixed And j2.fixed Return
		
		Local nx1#,ny1#,nx2#,ny2#
		
		Local dx#=j2.ox-j1.ox
		Local dy#=j2.oy-j1.oy
		Local d#=dx*dx+dy*dy
		If d>maxlength*maxlength
			code=1
			
			d=Sqrt(d)
			dx/=d
			dy/=d
			d = (d-maxlength)/2
			
			If j1.fixed
				nx2 -= 2*d*dx
				ny2 -= 2*d*dy
			Elseif j2.fixed
				nx1 += 2*d*dx
				ny1 += 2*d*dy
			Else
				nx1+=dx*d
				ny1+=dy*d
				nx2-=dx*d
				ny2-=dy*d
			Endif
			
		Elseif d<minlength*minlength
			code=2
			
			d=Sqrt(d)
			dx/=d
			dy/=d
			d = (d-minlength)/2
			
			If j1.fixed
				nx2 -= 2*d*dx
				ny2 -= 2*d*dy
			Elseif j2.fixed
				nx1 += 2*d*dx
				ny1 += 2*d*dy
			Else
				nx1+=dx*d
				ny1+=dy*d
				nx2-=dx*d
				ny2-=dy*d
			Endif
		
		Endif
		
		j1.x+=nx1*force
		j1.y+=ny1*force
		j2.x+=nx2*force
		j2.y+=ny2*force
	End
	
	Method Draw()
		Select code
		Case 0
			SetColor 255,255,255
		Case 1
			SetColor 255,0,0
		Case 2
			SetColor 0,0,255
		End
		
		'Local dx#=j2.x-j1.x
		'Local dy#=j2.y-j1.y
		'Local d#=Sqrt(dx*dx+dy*dy)
		'DrawText maxlength,(j1.x+j2.x)/2,(j1.y+j2.y)/2
		
		DrawLine j1.x,j1.y,j2.x,j2.y
	End
End

Class Hinge Extends Constraint
	Field j1:Joint,j2:Joint,j3:Joint
	Field an#,give#
	Field f1#,f2#
	
	Method New(_j1:Joint,_j2:Joint,_j3:Joint,_an#,_give#=0,_f1#=.5,_f2#=.1)
		j1=_j1
		j2=_j2
		j3=_j3
		an=_an
		give=_give
		f1=_f1
		f2=_f2
	End
	
	Method satisfy()
		If j1.fixed And j3.fixed Return
		
		Local dx1# = j1.ox-j2.ox
		Local dy1# = j1.oy-j2.oy
		Local d1# = Sqrt(dx1*dx1+dy1*dy1)
		Local dx2# = j3.ox-j2.ox
		Local dy2# = j3.oy-j2.oy
		Local d2# = Sqrt(dx2*dx2+dy2*dy2)
		
		Local an1# = ATan2(dy1,dx1)
		Local an2# = ATan2(dy2,dx2)
		Local pan# = andiff(an1,an2)
		
		Local d# = andiff(an,pan)/2
		
		If Abs(d)>give
			d*=f1
		Else
			d*=f2
		Endif		
			
			If j1.fixed
				an2-=d*2
			Elseif j3.fixed
				an1+=d*2
			Else
				an1+=d
				an2-=d
			Endif
			
			j1.x += j2.ox + Cos(an1)*d1-j1.ox
			j1.y += j2.oy + Sin(an1)*d1-j1.oy
			j3.x += j2.ox + Cos(an2)*d2-j3.ox
			j3.y += j2.oy + Sin(an2)*d2-j3.oy
	End
End

Class ClipClopApp Extends App
	Field h:Horse
	Field screenMatrix#[]
	Field mx#,my#
	
	Field state

	Method OnCreate()
		SetUpdateRate 60
		
		PushMatrix
		Translate DeviceWidth/2,DeviceHeight/2		
		Scale DeviceWidth()/400.0,DeviceHeight()/300.0
		screenMatrix = GetMatrix()
		PopMatrix
		
		h=New Horse(0,0)
		
	End
	
	Method OnUpdate()
		Local coords#[]
		coords = InvTransform([MouseX(),MouseY()])
		mx=coords[0]
		my=coords[1]
	
		h.hoof[state].x += (mx - h.hoof[state].x)*.05
		h.hoof[state].y += (my - h.hoof[state].y)*.05
		'h.Update mx,my
		
		If TouchHit(0)
			state = (state+1) Mod 4
		Endif
		
		h.satisfy
	End
	
	Method OnRender()
		Cls

		SetColor 255,255,255
		
		PushMatrix
		Transform screenMatrix[0],screenMatrix[1],screenMatrix[2],screenMatrix[3],screenMatrix[4],screenMatrix[5]
		
		h.Draw
		
		PopMatrix
	End
End

Function Main()
	New ClipClopApp
End


Function andiff#(an1,an2#)
	an1=(an1-an2) Mod 360
	If an1<-180 an1+=360
	If an1>180 an1-=360
	Return an1
End
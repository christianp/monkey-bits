
'the Vector and Quat classes should be immutable - don't change fields, create a new instance

Class Vector

	Private
		Field x#,y#,z#
	Public
	
	Method New()
	End
	
	Method New(_x#,_y#,_z#)
		x=_x
		y=_y
		z=_z
	End

	'calculate size of this vector
	Method modulus#()
		Return Sqrt(i*i + j*j + k*k)
	End
	
	'calculate the dot product of two vectors
	Function dotprod#(v1:Vector, v2:Vector)
		Return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
	End
	
	'calculate the angle between two vectors
	Function anglebetween#(v1:Vector, v2:Vector)
		Return ACos(dotprod(v1,v2))
	End

	'get a quaternion perpendicular to two given quaternions
	Function crossprod:Vector(v1:Vector, v2:Vector)
		Return New Vector( v1.j*v2.k - v1.k*v2.j, v1.k*v2.i - v1.i*v2.k, v1.i*v2.j - v1.j*v2.i)
	End
	
End

'a quaternion is a vector plus a rotation around that vector
Class Quat Extends Vector
	Private
		Field w#,i#,j#,k#
	Public
	
	Method New()	'identity quaternion
		w=1
	End
	
	Method New(_i#,_j#,_k#)
		w=1
		i=_i
		j=_j
		k=_k
		
		x=i
		y=j
		z=k
	End		
	
	Method New(_w#,_i#,_j#,_k#)
		w=_w
		i=_i
		j=_j
		k=_k
		
		'this quaternion can also be considered just as a vector pointing along its axis
		x=i
		y=j
		z=k
	End
	
	Method New(v:Vector)
		w=1
		i=v.x
		j=v.y
		k=v.z
		x=i
		y=j
		z=k
	End

	'multiply a vector by a quaternion
	Function mul:Vector(v1:Vector, q2:Quat)
		Return New Vector(q2.w*v1.x + v1.y*q2.k - q2.j*v1.z,		q2.w*v1.y + v1.z*q2.i - q2.k*v1.x,		q2.w*v1.z +v1.x*q2.j - q2.i*v1.y)
	End
	
	'multiply a quaternion by a vector
	Function mul:Vector(q1:Quat, v2:Vector)
		Return New Vector(q1.w*v2.x + q1.j*v2.z - v2.y*q1.k,		q1.w*v2.y + q1.k*v2.x - v2.z*q1.i,		q1.w*v2.z +q1.i*v2.y - v2.x*q1.j)
	End
	
	'multiply two quaternions together
	Function mul:Quat(q1:Quat,q2:Quat)
		Return New Quat(q1.w*q2.w - q1.i*q2.i - q1.j*q2.j - q1.k*q2.k,		q1.w*q2.i + q2.w*q1.i + q1.j*q2.k - q2.j*q1.k,		q1.w*q2.j + q2.w*q1.j + q1.k*q2.i - q2.k*q1.i,		q1.w*q2.k + q2.w*q1.k +q1.i*q2.j - q2.i*q1.j)
	End
	
	'add two quaternions together
	Function add:Quat(q1:Quat, q2:Quat)
		Return New Quat(q1.w+q2.w,	q1.i+q2.i, q1.j+q2.j, q1.k+q2.k)
	End
	
	'subtract q2 from q1
	Function sub:Quat(q1:Quat, q2:Quat)
		Return New Quat(q1.w-q2.w,	q1.i-q2.i, q1.j-q2.j, q1.k-q2.k)
	End
	
	'normalise this quaternion - make it have size 1
	Method normalise:Quat()
		Local d#=modulus()
		Return New Quat(w, i/d, j/d, k/d)
	End
	
	'conjugate
	Method conj:Quat()
		Return New Quat(w, -i, -j, -k)
	End
	
	'multiplicative inverse
	Method inverse:Quat()
		Local n#=w*w+i*i+j*j+k*k
		
		Return New Quat(w/n, -i/n, -j/n, -k/n)
	End
	
	'rotate a vector 'v' by a rotation quaternion 'r'
	Function rotate:Vector(v:vector, r:Quat)
		Return mult(r, mul(v, r.conj()) )
	End
	
	'get a quaternion representing a rotation of 'an' degrees around a vector 'p'
	Function rotaround:Quat(p:Vector,an#)
		an /= 2
		
		Local s# = Sin(an)
		
		Return New Quat( Cos(an), p.x*s, p.y*s, p.z*s )
	End
	
	'interpolate linearly between two quaternions. t=0 gives q1, t=1 gives q2.
	Function slerp:Quat( q1:Quat, q2:Quat, t# )
		Local an# = anglebetween(q1,q2)
		Local s# = Sin(an)
		
		If s=0
			Return q1
		End
		
		Local s1# = Sin((1-t)*an)/s
		Local s2# = Sin(t*an)/s
		
		Return New Quat(s1*q1.w + s2*q2.w, s1*q1.i + s2*q2.i, s1*q1.j + s2*q2.j, s1*q1.k + s2*q2.k)
	End
End


Class Sphere
	Field x#,y#,z#,r#
	Field pos:Vector
	
	Method New(_x#,_y#,_z#,_r#=1)
		x=_x
		y=_y
		z=_z
		r=_r
		
		pos = New Vector(x,y,z)
	End
	
	'pick a random point on this sphere
	Method randompoint:Vector()
		Local x1#=1
		Local x2#=1
		While x1*x1+x2*x2>1
			x1=Rnd(-1,1)
			x2=Rnd(-1,1)
		Wend
		Local t#=Sqr(1-x1*x1-x2*x2)
		Local px#=2*x1*t
		Local py#=2*x2*t
		Local pz#=1-2*(x1*x1+x2*x2)
		
		Return New Vector(0.0, x+px, y+py, z+pz)
	End
	
	'is the given point (assumed to be on this sphere) inside the given halfspace?
	Method inhalfspace:Bool(p:Vector, centre:Quat, an#)
		Return Vector.dotprod(Vector.sub(p,pos),centre)>Cos(an)
	End
	
	Method halfspacerandom:Vector(
End

'*********** HALFSPACES

'pick a random point in the given halfspace
Function halfspacerandom#[](pos#[],an#)
	s#=Sin(Rnd(90))
	fan#=Sqr(s)*an
	Local v#[]
	v=rotaround(sphererandom(),fan,True)
	v=rotate(pos,v)
	normalise v
	Return v
End Function

'is any part of the edge connecting p1 to p2 in the given halfspace?
Function edgeinhalfspace(p1#[],p2#[],p#[],an#)
	g1#=dotprod(p,p1)
	g2#=dotprod(p,p2)
	an=Cos(an)
	theta#=ACos(dotprod(p1,p2))
	u#=Tan(theta/2)
	a#=-u*u*(g1+an)
	b#=g1*(u*u-1)+g2*(u*u+1)
	c#=g1-an
	If b*b<4*a*c Return False
	s#=Sqr(b*b-4*a*c)
	s1#=(-b+s)/(2*a)
	s2#=(-b-s)/(2*a)
	If (s1>0 And s1<1) Or (s2>0 And s1<1) 
		Return True
	Endif
EndFunction


'do the two given halfspaces intersect?
Function halfspacesintersect(p1#[],an1#,p2#[],an2#)
	dp#=dotprod(p1,p2)
	an#=ACos(dp)
	Return an<an1+an2
End Function

'************* TRIANGLES

'is the given point on a sphere inside the given triangle?
Function intriangle(p#[],p1#[],p2#[],p3#[])
	Local v#[4]
	Local diff#[4]
	v=crossprod(p1,p2)
	diff[1]=p[1]-p1[1]
	diff[2]=p[2]-p1[2]
	diff[3]=p[3]-p1[3]
	dp1#=dotprod(v,diff)
	
	v=crossprod(p2,p3)
	normalise(v)
	diff[1]=p[1]-p2[1]
	diff[2]=p[2]-p2[2]
	diff[3]=p[3]-p2[3]
	dp2#=dotprod(v,diff)
	
	v=crossprod(p3,p1)
	normalise(v)
	diff[1]=p[1]-p3[1]
	diff[2]=p[2]-p3[2]
	diff[3]=p[3]-p3[3]
	dp3#=dotprod(v,diff)
	
	Return dotprod(p,p1)>0 And ((Sgn(dp1)=Sgn(dp2) And Sgn(dp2)=Sgn(dp3)) Or dp1*dp2*dp3=0)
End Function 

'************* DRAWING

'width and height of display
Const gwidth,gheight

'project a 3d point onto the screen
Function projx#(pos#[])
	Return projsize*pos[1]+gwidth/2
End Function

Function projy#(pos#[])
	Return projsize*pos[2]+gheight/2
End Function

'is a point on the front of the sphere?
'(I wrote all this code to display points on a globe. This function tells if a point is on the half of the sphere that the user can see)
Function inclip(pos#[])
	Return pos[3]<0
End Function

'draw a line between two points using SLERP
Function slerpline(p1#[],p2#[],s#=1)
	If Not (inclip(p1) Or inclip(p2)) Return
	Local p#[],op#[]
	
	an#=anglebetween(p1,p2)
	s:/an
	
	If s=0 Return
	
	op=p1
	ox#=projx(p1)
	oy#=projy(p1)
	t#=0
	While t<1
		p=slerp(p1,p2,t)
		If inclip(p)
			x#=projx(p)
			y#=projy(p)
			
			If inclip(op)
				DrawLine ox,oy,x,y
			Endif
			
			ox=x
			oy=y
		Endif
		op=p
		t:+s
	Wend

	If inclip(p2) And inclip(op)
		x=projx(p2)
		y=projy(p2)
		ox=projx(op)
		oy=projy(op)
		DrawLine ox,oy,x,y
	Endif
End Function

'draw a filled halfspace
'(not clever, doesn't clip round visible edge of sphere)
Function drawhalfspace(p#[],an#,bits=30)
	If Not inclip(p) Return
	Local v#[],ov#[]
	v=[p[0],p[2],p[3],p[1]]
	v=crossprod(v,p)
	normalise(v)
	v=rotate(p,rotaround(v,an))
	Local rr#[]
	anstep#=360.0/bits
	rr=rotaround(p,anstep)
	px#=projx(p)
	py#=projy(p)
	Local poly#[]
	ov=v
	For c=0 To bits
		poly=[px,py,projx(v),projy(v),projx(ov),projy(ov)]
		DrawPoly poly
		ov=v
		v=rotate(v,rr)
	Next
End Function


'************ TRIANGULATION OF THE SURFACE OF A SPHERE

'the surface of the sphere is divided into triangles, beginning with a regular icosahedron.

'each triangle, or trixel, can contain things. When a trixel has too many things in it, it subdivides into several smaller trixels, so each one has only a few things in.


Global trixels:TList=New TList
Type trixel
	Field p1#[],p2#[],p3#[]	'corners of triangle
	Field centre#[4]			'centre of triangle
	
	Field children:trixel[],parent:trixel	'this trixel's children, and a pointer to the trixel which subdivided into this one
	Field contents:TList,numcontents		'list of things in this trixel, and number of things in this trixel, for convenience
	Field name$							'name, 
	
	Function Initialise()	'call this exactly once, to initialise the grid
		d#=Sqr((10+2*Sqr(5))/4)
		a#=1/d
		b#=(1+Sqr(5))/(2*d)
		n=0
		Local ico#[][]
		ico=[ [0.0,0.0,a,b],[0.0,0.0,-a,b],[0.0,0.0,a,-b],[0.0,0.0,-a,-b],[0.0,a,b,0.0],[0.0,-a,b,0.0],[0.0,a,-b,0.0],[0.0,-a,-b,0.0],[0.0,b,0.0,a],[0.0,-b,0.0,a],[0.0,b,0.0,-a],[0.0,-b,0.0,-a]]
		Local tris[]
		tris=[0,1,8,0,4,8,4,8,10,6,8,10,1,6,8,1,6,7,3,6,7,3,7,11,2,3,11,2,3,10,2,4,10,2,4,5,0,4,5,0,5,9,0,1,9,1,7,9,7,9,11,5,9,11,2,5,11,3,6,10]
		For i=0 To 59 Step 3
			trixels.addlast trixel.Create((i/3)+"T",ico[tris[i]],ico[tris[i+1]],ico[tris[i+2]])
		Next
	End Function
	
	Method New()
		contents=New TList
	End Method
	
	Function Create:trixel(name$,p1#[],p2#[],p3#[],parent:trixel=Null)
		t:trixel=New trixel
		t.name=name
		t.p1=p1
		t.p2=p2
		t.p3=p3
		t.centre[1]=(p1[1]+p2[1]+p3[1])/3
		t.centre[2]=(p1[2]+p2[2]+p3[2])/3
		t.centre[3]=(p1[3]+p2[3]+p3[3])/3
		normalise(t.centre)
		t.parent=parent
		Return t
	End Function
	
	Method contains(p#[])	'is given point in this trixel?
		Return intriangle(p,p1,p2,p3)
	End Method
	
	Function findcontainer:trixel(p#[])			'find a trixel containing given point, anywhere on sphere
		For t:trixel=Eachin trixels
			If t.contains(p) Return t.container(p)
		Next
	End Function
	
	Method container:trixel(p#[])				'find child trixel containing given point, given that it lies inside this parent trixel
		If Not contains(p) Return Null
		If children
			For i=0 To 3
				t:trixel=children[i].container(p)
				If t Return t
			Next
		Else
			Return Self
		Endif
	End Method
	
	Method insert(th:thing)					'add a thing to this trixel's contents - might cause subdivision
		t:trixel=Self
		While t
			t.numcontents:+1
			t=t.parent
		Wend
		contents.addlast th
		th.t=Self
		If contents.count()>10
			subdivide()
			t:trixel=Self
			n=numcontents
			While t
				t.numcontents:-n
				t=t.parent
			Wend
			nc:TList=New TList
			For th:thing=Eachin contents
				t2:trixel=container(th.pos)
				If t2
					t2.insert th
				Else
					nc.addlast th
				Endif
			Next
			contents=nc
		Endif
	End Method
	
	Method remove(th:thing)					'remove a thing from this trixel - might cause a merge
		If Not contents.contains(th) Return
		numcontents:-1
		contents.remove th
		t:trixel=parent
		While t
			t.numcontents:-1
			t=t.parent
		Wend
		If parent And parent.numcontents<=10
			parent.merge
		Endif
	End Method
	
	
	Method subdivide()				'divide this trixel into four smaller trixels
		children=New trixel[4]
		Local p4#[4],p5#[4],p6#[4]
		p4[1]=(p1[1]+p2[1])/2
		p4[2]=(p1[2]+p2[2])/2
		p4[3]=(p1[3]+p2[3])/2
		p5[1]=(p3[1]+p2[1])/2
		p5[2]=(p3[2]+p2[2])/2
		p5[3]=(p3[3]+p2[3])/2
		p6[1]=(p1[1]+p3[1])/2
		p6[2]=(p1[2]+p3[2])/2
		p6[3]=(p1[3]+p3[3])/2
		normalise(p4)
		normalise(p5)
		normalise(p6)
		
		children[0]=trixel.Create(name+"0",p1,p4,p6,Self)
		children[1]=trixel.Create(name+"1",p4,p2,p5,Self)
		children[2]=trixel.Create(name+"2",p5,p3,p6,Self)
		children[3]=trixel.Create(name+"3",p4,p5,p6,Self)
	End Method
	
	Method merge()					'merge this subdivided trixel back together again
		'contents=New TList
		For i=0 To 3
			For th:thing=Eachin children[i].contents
				contents.addlast th
				th.t=Self
			Next
		Next
		children=Null
	End Method
		
	Method intersectshalfspace(p#[],an#)	'does this trixel intersect given halfspace?
		'find if any corners inside halfspace
		If inhalfspace(p1,p,an) Or inhalfspace(p2,p,an) Or inhalfspace(p3,p,an) Return True	'all or some points in halfspace means yes
		
		'check if bounding circle intersects halfspace
		Local v1#[4],v2#[4],v#[]
		v1=quatsub(p2,p1)
		v2=quatsub(p3,p1)
		v=crossprod(v1,v2)
		normalise v
		db#=ACos(dotprod(p1,v))
		dp#=dotprod(p,v)
		anb#=ACos(dp)
		
		If anb>90 anb=180-anb
		If anb>an+db Return False	'bounding circle doesn't intersect means no
				
		If edgeinhalfspace(p1,p2,p,an) Or edgeinhalfspace(p2,p3,p,an) Or edgeinhalfspace(p1,p3,p,an) Return True
		
		If contains(p) Return True	'if centre of halfspace is inside triangle then yes
	End Method
	
	Function findinhalfspace:trixel[](p#[],an#)	'find all trixels intersecting given halfspace
		Local ins:trixel[0]
		For t:trixel=Eachin trixels
			ins:+t.kidsinhalfspace(p,an)
		Next
		Return ins
	End Function
	
	Function thingsinhalfspace:TList(p#[],an#)	'find all things in given halfspace
		Local ins:trixel[]
		ins=trixel.findinhalfspace(p,an)
		ts:TList=New TList
		For t:trixel=Eachin ins
			For th:thing=Eachin t.contents
				If inhalfspace(th.pos,p,an)
					ts.addlast th
				Endif
			Next
		Next
		Return ts
	End Function
	
	Method kidsinhalfspace:trixel[](p#[],an#)	'find child trixels intersecting given halfspace
		If Not intersectshalfspace(p,an) Return
		If children
			Local ins:trixel[]
			For i=0 To 3
				ins:+children[i].kidsinhalfspace(p,an)
			Next
			Return ins
		Else
			Return [Self]
		Endif
	End Method
End Type

'things which can be placed in a trixel should extend this type
Global things:TList=New TList
Type thing
	Field pos#[]
	Field t:trixel
	
	Method New()
		things.addlast Self
	End Method

	Method place()
		t=trixel.findcontainer(pos)
		t.insert Self
	End Method
	
	
	Method die()
		things.remove Self
		If t
			t.remove Self
		Endif
	End Method
End Type


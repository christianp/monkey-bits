Import mojo

Const worldwidth#=400,worldheight#=300

'generate N random values, which add up to total.
'if add is true, then the array returned will be the running total of the values (so the last value in the array will be the specified total)
Function RandomSpread#[](n,total#,min#=0,add:Bool=True)
	Local arr#[n]
	Local wt#=0,r#
	Local i
	For i=0 To n-1
		r = Rnd(min,1)
		wt+=r
		If add
			arr[i]=wt
		Else
			arr[i]=r
		Endif
	Next
	For i=0 To n-1
		arr[i] *=total/wt
	Next
	Return arr
End

Class Polygon
	Field points#[]
	
	Method New(_points#[])
		points = _points
	End
	
	Method Draw()
		For Local i=0 To points.Length-3 Step 2	
			DrawLine points[i], points[i+1], points[i+2], points[i+3]
		Next
		DrawLine points[points.Length-2],points[points.Length-1], points[0],points[1]
	End
End

'every object in the game is a Thing
'the Thing class handles drawing, movement, collisions, etc.
Class Thing
	Global all:=New List<Thing>

	Field x#,y#,an#
	Field vx#,vy#,van#
	Field size#

	Field poly:Polygon
	Field red,green,blue
	
	Field mass#,grace:Bool,hits
	
	Method New(_x#,_y#,_size#)
		x=_x
		y=_y
		size=_size
		
		Thing.all.AddLast Self
	End
	
	Function UpdateAll()
		Local colls:=New Stack<Thing>
		Local t:Thing
		
		'update every object, and build the list of objects to test for collisions with each other
		For t=Eachin Thing.all
			t.Update
			If t.mass>0 colls.Push t 'only include objects in the collision tests if they have a mass. This way, setting an object's mass to zero can make it not collide with anything
		Next
		
		TestCollisions colls
	End
	
	Function TestCollisions(colls:Stack<Thing>)
		Local t:Thing
		While colls.Length>0
			'by using a stack, and popping an object off the top before testing it for collisions with every other object, we avoid doing duplicate collision tests
			t = colls.Pop
			
			Local numhits=0
			For Local t2:=Eachin colls
				
				'get the difference between the two objects' positions.
				Local dx#=t2.x-t.x
				Local dy#=t2.y-t.y
				
				'because the universe wraps around, the two objects might be closer to each other than we think if they're near opposite edges of the screen
				If dx>worldwidth/2 dx-=worldwidth
				If dx<-worldwidth/2 dx+=worldwidth
				If dy>worldheight/2 dy-=worldheight
				If dy<-worldheight/2 dy+=worldheight

				'get the square of the distance between the two things
				Local d#=dx*dx+dy*dy
				If d<(t.size+t2.size)*(t.size+t2.size)
					'bounce
					d=Sqrt(d)
					dx /= d
					dy /= d
					Local f# = t.size+t2.size-d
					Local w2# = t.mass/t2.mass
					Local w#=t2.mass/t2.mass
					If Not t2.grace				'the 'grace' field is so objects which begin their lives intersecting another one don't go flying way off
						t2.vx += w2*f*dx
						t2.vy += w2*f*dy
					Endif
					If Not t.grace
						t.vx -= w*f*dx
						t.vy -= w*f*dy
					Endif
					t2.x += w2*f*dx*2
					t2.y += w2*f*dy*2
					t.x -= w*f*dx*2
					t.y -= w*f*dy*2
					
					'angular friction
					Local fan#=(t.van+t2.van)*.3
					t2.van -= w2*fan*t.size/t2.size
					t.van -= w*fan*t2.size/t.size
					
					'make some flashy sparks
					For Local i=0 To Int(Abs(fan)+Abs(f))/4
						Local s:=New Spark(t.x+dx*d/2,t.y+dy*d/2)
					Next

					'tell each object they've been hit
					t2.Hit t
					t.Hit t2
					
					t2.hits+=1
					t.hits+=1
				Endif
			Next
		Wend
	End
	
	'update position and rotation
	Method Update()
		x += vx
		y += vy
		an += van
		
		'wrap around at the edges of the screen
		If x<-worldwidth/2 x+=worldwidth
		If x>worldwidth/2 x-=worldwidth
		If y<-worldheight/2 y+=worldheight
		If y>worldheight/2 y-=worldheight
		
		If grace And hits=0
			grace=False
		Endif
	End
	
	Function DrawAll()
		For Local t:=Eachin Thing.all
			t.Draw
		Next
		
		'if an object is near an edge of the screen, we need to draw it again next to the opposite edge
		PushMatrix
			Translate -worldwidth,0
			For Local t:=Eachin Thing.all
				'If t.x>worldwidth/2-t.size*2 t.Draw
				t.Draw
			Next
		PopMatrix
		PushMatrix
			Translate worldwidth,0
			For Local t:=Eachin Thing.all
				'If t.x<-worldwidth/2+t.size*2 t.Draw
				t.Draw
			Next
		PopMatrix
		PushMatrix
			Translate 0,-worldheight
			For Local t:=Eachin Thing.all
				'If t.y>worldheight/2-t.size*2 t.Draw
				t.Draw
			Next
		PopMatrix
		PushMatrix
			Translate 0,worldheight
			For Local t:=Eachin Thing.all
				'If t.y<-worldheight/2+t.size*2 t.Draw
				t.Draw
			Next
		PopMatrix
	End
	
	Method Draw()
		SetColor red,green,blue
		PushMatrix
			Translate x,y
			Rotate an
			poly.Draw
		PopMatrix
	End
	
	Method Hit(t:Thing) Abstract
	
	Method Die()
		Thing.all.Remove Self
	End
End	

Class Asteroid Extends Thing
	Field van#	'speed of rotation
	
	Method New(_x#,_y#,_size#=worldheight/8)
		Super.New(_x,_y,_size)

		'generate a randomly wobbly polygon
		Local numpoints:Int = Rnd(8,15)
		Local angles#[]=RandomSpread(numpoints,360,.5)
		Local points#[numpoints*2]
		
		For Local i=0 To numpoints-1
			Local r#=size*Rnd(.7,1.3)
			points[i*2] = Cos(angles[i])*r
			points[i*2+1] = Sin(angles[i])*r
		Next
		poly = New Polygon(points)
		
		'pick an asteroidy colour
		Local shade#=Rnd(.5,1)
		red = 150*shade
		green = 150*shade
		blue = 50*shade
		
		'pick a velocity
		vx = Rnd(-.5,.5)
		vy = Rnd(-.5,.5)
		van = Rnd(.5,3)
		
		mass = size
	End
	
	Method Die()
		Super.Die
		
		'split into smaller asteroids. Really small asteroids don't split up, to save your sanity
		If size>10
			Local numsubs:Int = Rnd(2,4)
			Local sizes#[] = RandomSpread(numsubs,size,.5,False)
			Local angles#[] = RandomSpread(numsubs,360,.5)
			
			For Local i=0 To numsubs-1
				Local a:=New Asteroid(x,y,sizes[i])
				
				'spread them out so they don't intersect
				a.x+= a.size*1.5*Sin(angles[i])
				a.y+= a.size*1.5*Cos(angles[i])
				
				Local v#=Sqrt(vx*vx+vy*vy)*Rnd(.2,.5)
				a.vx = Sin(angles[i])*v + vx
				a.vy = Cos(angles[i])*v + vy
			Next
		End
		
		'make some crashy sparks
		Local numsparks=Rnd(5,15)
		For Local i=1 To numsparks
			Local s:Spark = New Spark(x,y)
			s.vx += vx
			s.vy += vy
		Next
	End
		
	Method Hit(t:Thing)
		If Bullet(t)
			Die
		End
	End
End

Class Spark Extends Thing
	Field life#=1
	
	Method New(_x#,_y#)
		Super.New(_x,_y,0)
		Local v#=Rnd(1,2)
		size=v/2
		
		an=Rnd(360)
		vx=v*Sin(an)
		vy=v*Cos(an)
		
		mass = 0
	End
	
	Method Update()
		Super.Update
		
		life-=Rnd(.1)
		
		If life<=0
			Die
			Return
		Endif

		red=255*(Min(life,.5)+.5)
		green=255*life
		blue=0
	End
	
	Method Draw()
		SetColor red,green,blue
		DrawLine x,y,x-vx,y-vy
	End
	
	Method Hit(t:Thing)
	End
End

Class Ship Extends Thing
	Field reload
	
	Method New()
		Super.New(0,0,10)
		red=255
		green=255
		blue=255
		
		an = 180
		
		poly = New Polygon([0.0,10.0,Sin(130)*10,Cos(130)*10,Sin(230)*10,Cos(230)*10])
		
		mass = 20
	End
	
	Method Update()
		Super.Update
		
		'turning controls
		van += (KeyDown(KEY_LEFT) - KeyDown(KEY_RIGHT))*.5
		van *= .95
		
		'thrust controls
		Local thrust#=(KeyDown(KEY_UP)-KeyDown(KEY_DOWN))*.1
		vx += Sin(an)*thrust
		vy += Cos(an)*thrust
		
		'create sparks for thrust
		If thrust<>0
			Local s:=New Spark(x-Sgn(thrust)*Sin(an)*10,y-Sgn(thrust)*Cos(an)*10)
			Local san#=Rnd(an-10,an+10)
			s.vx = -Sgn(thrust)*Sin(san)+vx
			s.vy = -Sgn(thrust)*Cos(san)+vy
		End
		
		'shooting controls
		reload=Max(reload-1,0)
		If KeyDown(KEY_SPACE) And reload=0
			New Bullet(x+Sin(an)*15,y+Cos(an)*15,vx+Sin(an),vy+Cos(an))
			reload=25
		Endif
	End
	
	Method Hit(t:Thing)
		If Asteroid(t)
			Die
		End
	End
	
	Method Die()
		Super.Die
		
		'lots of crashy sparks
		Local numsparks=Rnd(15,30)
		For Local i=1 To numsparks
			Local s:Spark = New Spark(x,y)
			s.vx += vx
			s.vy += vy
		Next
	End
End

Class Bullet Extends Thing
	Field life=400
	Method New(_x#,_y#,_vx#,_vy#)
		Super.New(_x,_y,1)
		
		vx=_vx
		vy=_vy
		
		mass = 2
	End
	
	Method Update()
		Super.Update
		
		life -= 1
		If life<=0
			Die
		End
	End
	
	Method Draw()
		SetColor 0,0,255
		DrawCircle x,y,1
	End
	
	Method Hit(t:Thing)
		Die
	End
End

Class AsteroidsApp Extends App
	Field screenMatrix#[]
	Field countdown
	
	Method MakeLevel()
		Thing.all=New List<Thing>
		
		'create 5 asteroids and spread them in a circle
		Local angles#[]=RandomSpread(5,360,.5)
		For Local i=0 To 4
			Local an# = angles[i]
			Local r#=Rnd(.5,.9)*worldheight/2
			New Asteroid( r*Sin(an), r*Cos(an) )
		Next
		
		New Ship
	End

	Method OnCreate()
		SetUpdateRate 60
		
		'dirty trick to get a truly random number - do lots of computing, and time how long that takes
		'wouldn't need to do this if we had a way of getting the real time
		For Local c=1 To 10000000
			Sqrt(50)
		Next
		Seed = Millisecs()*1000
		
		'get a transformation which puts (0,0) in the centre of the screen, and makes the play area the right size
		PushMatrix
		Translate DeviceWidth/2,DeviceHeight/2		
		Scale DeviceWidth()/worldwidth,DeviceHeight()/worldheight
		screenMatrix = GetMatrix()
		PopMatrix
		
		'set up the level
		MakeLevel
	End
	
	Method OnUpdate()
		PushMatrix
		SetMatrix screenMatrix
		
			'update every object
			Thing.UpdateAll
			
			If Not countdown
				'if there are no asteroids or the ship is dead, the game is over
				Local numasteroids,numships
				For Local t:=Eachin Thing.all
					If Asteroid(t) numasteroids+=1
					If Ship(t) numships+=1
				Next
				If numasteroids=0 Or numships=0
					countdown=150
				End
			Else
				countdown -= 1
				If countdown=1 MakeLevel
			Endif
		
		PopMatrix
	End
	
	Method OnRender()
		Cls

		PushMatrix
		SetMatrix screenMatrix
		
			'draw every object
			Thing.DrawAll
			
			If countdown
				SetAlpha (150-countdown)/150.0
				SetColor 255,0,0
				DrawRect -worldwidth/2,-worldheight/2,worldwidth,worldheight
				SetAlpha 1
			Endif
		
		PopMatrix
	End
End

Function Main()
	New AsteroidsApp
End


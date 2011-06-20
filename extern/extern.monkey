'Using external functions to make use of HTML forms
'by Christian Perfect

'Here's a little game where some AI-controlled spaceships try to shoot each other.
'The player can add or remove ships by using an HTML form to the side of the game canvas.
'The mechanics of the game aren't very interesting; the point of this example is to show how monkey code can call native code, and vice-versa.
'In addition, the game page loads the javascript library jQuery to make manipulating the HTML ship list easier.

'One thing that needs to be noted is that the compiler will omit any functions defined here which don't look like they can be called from monkey code.
'I needed to write some pretend calls to the makeShip and Ship.kill functions so that they get included in the compiled code. They're inside the Main() function, and never actually get called.

Import mojo

'The external functions are all defined in externs.js
Import "externs.js"

Extern

Function initScore() = "initScore"
Function addPlayer:Int(name$) = "addPlayer"
Function setScore(name$,score:Int) = "setScore"

Public

'This is a basic class to represent all physical objects in the game
Class Thing
	Field x#,y#,vx#,vy#

	Global all:List<Thing>

	Method Update()
		x+=vx
		y+=vy
		If x<-320 x+=640
		If x>320 x-=640
		If y<-240 y+=480
		If y>240 y-=480
	End

	Method Draw() Abstract
End

'this object represents an AI-controlled ship. The interesting parts are the calls to addPlayer, in the New method, and setScore, in the addpoint method, which call external functions
'the kill function will be called by the native code when the player clicks on a ship's name in the list.
Class Ship Extends Thing
	Global all:List<Ship>

	Field name$
	Field an#,van#
	Field life
	Field points
	Field speed#

	Field target:Ship

	Function kill(name$)
		For Local s:=Eachin all
			If s.name=name
				s.die
			End
		Next
	End

	Method New(name$)
		Local name2$=name
		Local n=0
		Local go=0
		While Not go
			go=1
			For Local s:=Eachin all
				If s.name=name2
					go=0
					n+=1
					name2=name+n
				Endif
			Next
		Wend
		name=name2
		Self.name = name
		addPlayer(name)			'add this ship to the list of players on the page
		x = Rnd(-320,320)
		y = Rnd(-240,240)
		speed=Rnd(.2,1)
		life = 10
		all.AddLast Self
		Thing.all.AddLast Self
	End

	Method Update()
		vx *= .99
		vy *= .99
		vx -= x*.00001
		vy -= y*.00001
		an+=van
		van*=.9

		Super.Update()

		Local dx#,dy#,d#
		Local closest:Ship
		Local mindist#=-1
		For Local d2:= Eachin all
			If d2<>Self
				dx=d2.x-x
				dy=d2.y-y
				d = dx*dx+dy*dy
				If (d<mindist Or mindist=-1)
					mindist=d
					closest=d2
				Endif
			Endif
		Next
		If Not target
			target = closest
		Endif
		If target
			dx =target.x-x
			dy = target.y-y
			d=dx*dx+dy*dy
			If d<200*200 Or closest=target
				Local dan#=ATan2(dy,dx)
				dan -= an
				dan = dan Mod 360
				If dan<-180 dan+=360
				If dan>180 dan-=360
				If Abs(dan)<10 And Rnd(10)<1
					shoot
				Endif
				van += Min(Abs(dan/3),3.0)*Sgn(dan)*.2
				Local dp#=Cos(dan)
				If dp>0
					vx+=Cos(an)*dp*.05*speed
					vy+=Sin(an)*dp*.05*speed
				End
			Else
				target = Null
			Endif
		Endif
	End

	Method shoot()
		New Bullet(Self)
	End

	Method hurt()
		life -= 1
		If life<0
			respawn
		End
	End

	Method respawn()
		life=10
		x=Rnd(-320,320)
		y=Rnd(-240,240)
		an=Rnd(360)
	End

	Method addpoint()
		points += 1
		setScore(name,points)			'update this ship's score in the list.
	End

	Method die()
		Thing.all.Remove Self
		Ship.all.Remove Self
		For Local s:=Eachin all
			If s.target=Self
				s.target=Null
			Endif
		Next
	End

	Method Draw()
		PushMatrix
		Translate x,y
		Rotate -an
		DrawCircle 0,0,5
		DrawLine 0,0,10,0
		Rotate -90
		DrawText name,0,0
		PopMatrix
	End
End

Class Bullet Extends Thing
	Global all:List<Bullet>
	
	Field life
	Field owner:Ship

	Method New(owner:Ship)
		Thing.all.AddLast Self
		all.AddLast Self
		Self.owner = owner
		Self.x = owner.x
		Self.y = owner.y
		Self.vx = Cos(owner.an)*5+owner.vx
		Self.vy = Sin(owner.an)*5+owner.vy
	End

	Method Update()
		Super.Update()
		life+=1
		If life>100
			die
		Endif
		doCollisions
	End

	Method doCollisions()
		Local dx#,dy#,d#
		For Local s:=Eachin Ship.all
			If s<>owner
				dx = s.x-x
				dy = s.y-y
				d=dx*dx+dy*dy
				If d<25
					s.vx += vx*.1
					s.vy += vy*.1
					s.hurt
					owner.addpoint
					die
					Return
				Endif
			Endif
		Next

		If x<-320 Or x>320 Or y<-240 Or y>240
			die
		End
	End

	Method die()
		Bullet.all.Remove Self
		Thing.all.Remove Self
	End

	Method Draw()
		DrawRect x,y,1,1
	End Method
End

Class TestApp Extends App

	Method OnCreate()
		Seed = Millisecs()
		initScore

		SetUpdateRate 60

		Thing.all = New List<Thing>
		Ship.all = New List<Ship>
		Bullet.all = New List<Bullet>

		New Ship("Jim")
		New Ship("Delilah")
	End

	Method OnUpdate()
		For Local t:=Eachin Thing.all
			t.Update
		Next
	End

	Method OnRender()
		Cls
		SetColor 255,255,255

		PushMatrix
		Translate 320,240

		For Local t:=Eachin Thing.all
			t.Draw
		Next

		PopMatrix
	End
End


'this is a function which the native code can call to create a new ship, because it doesn't have access to monkey's constructor for the ship object.
Function makeShip(name$)
	New Ship(name)
End

Global myapp:TestApp

Function Main()
	myapp = New TestApp
	
	'make javascript hooky functions get compiled
	If 0=1
		makeShip("")
		Ship.kill("")
	Endif
End



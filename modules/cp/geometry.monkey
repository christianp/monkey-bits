Function distance#(x1#,y1#,x2#,y2#)
	x2 -= x1
	y2 -= y1
	Return Sqrt(x2*x2+y2*y2)
End

Function pointlinedistance#(px#,py#,ax#,ay#,bx#,by#)
	Local dx#=bx-ax
	Local dy#=by-ay
	Local an#=ATan2(dy,dx)
	Local nx#=Cos(an+90)
	Local ny#=Sin(an+90)
	Local lambda#=(py-ay+(ax-px)*dy/dx)/(nx*dy/dx-ny)
	Return lambda
End Function

Function linesintersect#(ax#,ay#,bx#,by#,cx#,cy#,dx#,dy#,fit=0)
	'fit, bitmask, set:
	' 1: doesn't need to be on first segment
	' 2: doesn't need to be on second segment
	bx -= ax
	by -= ay
	dx -= cx
	dy -= cy
	
	Local lambda#,mu#
	
	If dx<>0
		lambda=(cy-ay+(ax-cx)*dy/dx)/(by-bx*dy/dx)
	Else
		lambda=(cx-ax+(ay-cy)*dx/dy)/(bx-by*dx/dy)
	Endif
	If bx<>0
		mu=(ay-cy+(cx-ax)*by/bx)/(dy-dx*by/bx)
	Else
		mu=(ax-cx+(cy-ay)*bx/by)/(dx-dy*bx/by)
	Endif
	
	If (lambda>=0 And lambda<=1) Or (fit & 1)
	 If (mu>=0 And mu<=1) Or (fit & 2)
		Return lambda
	 Endif
	Endif
	Return -1
End Function
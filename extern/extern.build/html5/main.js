
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	game_console=document.getElementById( "GameConsole" );
	
	
	try{
		bb_Init();
		bb_Main();
	}catch( ex ){
		if( ex ) alert( ex );
		return;
	}
	
	if( game_runner!=null ){
		game_runner();
	}
}

//Globals
var game_canvas;
var game_console;
var game_runner;

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n";

//${METADATA_END}
function getMetaData( path,key ){	
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	if( path=="" ) return "";
//${TEXTFILES_BEGIN}
		return "";

//${TEXTFILES_END}
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var err_info="";
var err_stack=[];

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	var str="";
	push_err();
	err_stack.reverse();
	for( var i=0;i<err_stack.length;++i ){
		str+=err_stack[i]+"\n";
	}
	err_stack.reverse();
	pop_err();
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
}

function error( err ){
	throw err;
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index>=0 && index<arr.length ) return arr;
	error( "Array index out of range" );
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}



// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var dead=false;

var KEY_LMB=1;
var KEY_RMB=2;
var KEY_MMB=3;
var KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	
	this.startMillis=(new Date).getTime();
	
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
		canvas.onkeydown=function( e ){
			app.input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) app.input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<124) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			app.input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				app.input.PutChar( e.charCode );
			}else if( e.which ){
				app.input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			app.input.OnKeyDown( KEY_LMB );
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			app.input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			//app.InvokeOnResume();
		}
		
		canvas.onblur=function( e ){
			//app.InvokeOnSuspend();
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}
	
	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( ex ){
	dead=true;
	this.audio.OnSuspend();
	if( ex ) alert( ex+"\n"+stackTrace() );
	throw ex;
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( dead ) return;
	
	try{
		this.OnCreate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( dead || !this.suspended ) return;
	
	try{
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var bits=document.cookie.split( ";" )
		if( bits.length!=1 ) return "";
		bits=bits[0].split( "=" );
		if( bits.length!=2 || bits[0]!=".mojostate" ) return "";
		return unescape( bits[1] );
	}else{
		var state=localStorage.getItem( ".mojostate@"+document.URL );
		if( state ) return state;
	}
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var exdate=new Date();
		exdate.setDate( exdate.getDate()+3650 );
		document.cookie=".mojostate="+escape( state )+"; expires="+exdate.toUTCString()
	}else{
		localStorage.setItem( ".mojostate@"+document.URL,state );
	}
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.color="rgb(255,255,255)"
	this.alpha=1.0;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	};

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.DestroySurface=function( surface ){
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;			//Safari Kludge!
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;			//Safari Kludge!
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( surface.image.complete ) this.gc.drawImage( surface.image,x,y );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;	//Safari Kludge!
	//
	if( surface.image.complete ) this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	for( var i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];	
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
}

gxtkInput.prototype.PutChar=function( char ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=char;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
}

//***** GXTK API *****

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var char=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return char;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.mouseX;
}

gxtkInput.prototype.TouchY=function( index ){
	return this.mouseY;
}

gxtkInput.prototype.AccelX=function(){
	return 0;
}

gxtkInput.prototype.AccelY=function(){
	return 0;
}

gxtkInput.prototype.AccelZ=function(){
	return 0;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.audio=null;
	this.sample=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.DestroySample=function( sample ){
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];
	
	if( chan.sample==sample && chan.audio ){	//&& !chan.audio.paused ){
		chan.audio.loop=(flags&1)!=0;
		chan.audio.volume=chan.volume;
		try{
			chan.audio.currentTime=0;
		}catch(ex){
		}
		chan.audio.play();
		return;
	}

	if( chan.audio ) chan.audio.pause();
	
	var audio=sample.AllocAudio();
	
	if( audio ){
		for( var i=0;i<33;++i ){
			if( this.channels[i].audio==audio ){
				this.channels[i].audio=null;
				break;
			}
		}
		audio.loop=(flags&1)!=0;
		audio.volume=chan.volume;
		audio.play();
	}
	
	chan.audio=audio;
	chan.sample=sample;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.pause();
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio && !chan.audio.paused && !chan.audio.ended ) return 1;
	return 0;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.DestroySample( this.music );
		this.music=null;
	}
}

gxtkAudio.prototype.MusicState=function(){

	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){

	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.insts=new Array( 8 );
}

gxtkSample.prototype.AllocAudio=function(){
	for( var i=0;i<8;++i ){
		var audio=this.insts[i];
		if( audio ){
			//Ok, this is ugly but seems to work best...no idea how/why!
			if( audio.paused ){
				if( audio.currentTime==0 ) return audio;
				audio.currentTime=0;
			}else if( audio.ended ){
				audio.pause();
			}
		}else{
			audio=new Audio( this.audio.src );
			this.insts[i]=audio;
			return audio;
		}
	}
	return null;
}
//initialise the ship score list
function initScore()
{
	$('#GameConsole').hide();
	$('#scoreThing').hide();
}

//an object representing a ship. We could combine this with the monkey Ship object, but that would need an Extern class, which is a topic for another day.
function Player(name)
{
	this.name = name;
	Player.players[name] = this;

	//create a list item for this player, initialise it, and save a jQuery selector for it
	var hc = this.hc = $('#scoreThing')			
		.clone()
		.attr('id','scoreThing-'+name)
		.click(function(){removePlayer(name);})
		.show()
	;
	$('#scores').append(hc);
	this.setScore(0);
}

Player.prototype = {
	htmlContext: function()
	{
		return this.hc;
	},
	setScore: function(score)
	{
		this.score = score;

		var hc = this.htmlContext();
		hc.html(this.name+': '+this.score+' points');
	}
}
Player.players = {};

//sort the list of ships by their scores
Player.sort = function()
{
	var listitems = $('#scores li:visible').get();
	listitems.sort(function(a,b) {
		var re = /.*\-(.+)/;
		var n1 = $(a).attr('id').match(re)[1];
		var n2 = $(b).attr('id').match(re)[1];
		var s1 = Player.players[n1].score;
		var s2 = Player.players[n2].score;
		return s1 < s2 ? 1 : (s1 > s2 ? -1 : 0);
	});
	$(listitems).each(
		function(id,elem){
			$('#scores').append(elem);
		}
	);
}


//add a ship to the list
function addPlayer(name)
{
	var player = new Player(name);
}

//remove a ship from the list
function removePlayer(name)
{
	var player = Player.players[name];
	player.htmlContext().remove();
	delete Player.players[name];
	bb_extern_Ship_kill(player.name);
}

//this function is called when the user clicks on the "Add Player" button under the score list.
function newShip()
{
	var name = $('#namebox').val();
	$('#namebox').val('');
	bb_extern_makeShip(name)	//call the monkey function to create a new ship with the name the user typed in.
}

//this function is called by the monkey code whenever a ship scores a point.
//it will update the score list and sort it
function setScore(name,score)
{
	var player = Player.players[name];
	if(!player)
		return;
	player.setScore(score);
	Player.sort();
}



function bbappApp(){
	Object.call(this);
}
function bbappnew(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<101>";
	bbappdevice=bbappnew2.call(new bbappAppDevice,this);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<100>";
	var bb=this;
	pop_err();
	return bb;
}
bbappApp.prototype.bbOnCreate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<104>";
	pop_err();
	return 0;
}
bbappApp.prototype.bbOnUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<107>";
	pop_err();
	return 0;
}
bbappApp.prototype.bbOnSuspend=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<110>";
	pop_err();
	return 0;
}
bbappApp.prototype.bbOnResume=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<113>";
	pop_err();
	return 0;
}
bbappApp.prototype.bbOnRender=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<116>";
	pop_err();
	return 0;
}
bbappApp.prototype.bbOnLoading=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<119>";
	pop_err();
	return 0;
}
function bbexternTestApp(){
	bbappApp.call(this);
}
bbexternTestApp.prototype=extend_class(bbappApp);
function bbexternnew(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<244>";
	bbappnew.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<244>";
	var bb=this;
	pop_err();
	return bb;
}
bbexternTestApp.prototype.bbOnCreate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<247>";
	bbrandomSeed=bbappMillisecs();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<248>";
	initScore();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<250>";
	bbappSetUpdateRate(60);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<252>";
	bbexternall=bblistnew.call(new bblistList);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<253>";
	bbexternall2=bblistnew.call(new bblistList);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<254>";
	bbexternall3=bblistnew.call(new bblistList);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<256>";
	bbexternnew3.call(new bbexternShip,"Jim");
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<257>";
	bbexternnew3.call(new bbexternShip,"Delilah");
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<246>";
	pop_err();
	return 0;
}
bbexternTestApp.prototype.bbOnUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<261>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<261>";
	var bb=bbexternall.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<261>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<261>";
		var bbt=object_downcast((bb.bbNextObject()),bbexternThing);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<262>";
		bbt.bbUpdate();
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<260>";
	pop_err();
	return 0;
}
bbexternTestApp.prototype.bbOnRender=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<267>";
	bbgraphicsCls(0.000000,0.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<268>";
	bbgraphicsSetColor(255.000000,255.000000,255.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<270>";
	bbgraphicsPushMatrix();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<271>";
	bbgraphicsTranslate(320.000000,240.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<273>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<273>";
	var bb=bbexternall.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<273>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<273>";
		var bbt=object_downcast((bb.bbNextObject()),bbexternThing);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<274>";
		bbt.bbDraw();
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<277>";
	bbgraphicsPopMatrix();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<266>";
	pop_err();
	return 0;
}
function bbappAppDevice(){
	gxtkApp.call(this);
	this.bbapp=null;
}
bbappAppDevice.prototype=extend_class(gxtkApp);
function bbappnew2(bbapp){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<51>";
	dbg_object(this).bbapp=bbapp;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<52>";
	bbgraphicsSetGraphicsContext(bbgraphicsnew.call(new bbgraphicsGraphicsContext,this.GraphicsDevice()));
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<53>";
	bbinputSetInputDevice(this.InputDevice());
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<54>";
	bbaudioSetAudioDevice(this.AudioDevice());
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<50>";
	var bb=this;
	pop_err();
	return bb;
}
function bbappnew3(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<48>";
	var bb=this;
	pop_err();
	return bb;
}
bbappAppDevice.prototype.OnCreate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<58>";
	bbgraphicsSetFont(null,32);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<59>";
	var bb=this.bbapp.bbOnCreate();
	pop_err();
	return bb;
}
bbappAppDevice.prototype.OnUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<63>";
	var bb=this.bbapp.bbOnUpdate();
	pop_err();
	return bb;
}
bbappAppDevice.prototype.OnSuspend=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<67>";
	var bb=this.bbapp.bbOnSuspend();
	pop_err();
	return bb;
}
bbappAppDevice.prototype.OnResume=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<71>";
	var bb=this.bbapp.bbOnResume();
	pop_err();
	return bb;
}
bbappAppDevice.prototype.OnRender=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<75>";
	bbgraphicsBeginRender();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<76>";
	var bbr=this.bbapp.bbOnRender();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<77>";
	bbgraphicsEndRender();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<78>";
	pop_err();
	return bbr;
}
bbappAppDevice.prototype.OnLoading=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<82>";
	bbgraphicsBeginRender();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<83>";
	var bbr=this.bbapp.bbOnLoading();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<84>";
	bbgraphicsEndRender();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<85>";
	pop_err();
	return bbr;
}
function bbgraphicsGraphicsContext(){
	Object.call(this);
	this.bbdevice=null;
	this.bbdefaultFont=null;
	this.bbfont=null;
	this.bbfirstChar=0;
	this.bbmatrixSp=0;
	this.bbix=1.000000;
	this.bbiy=.0;
	this.bbjx=.0;
	this.bbjy=1.000000;
	this.bbtx=.0;
	this.bbty=.0;
	this.bbtformed=0;
	this.bbmatDirty=0;
	this.bbcolor_r=.0;
	this.bbcolor_g=.0;
	this.bbcolor_b=.0;
	this.bbalpha=.0;
	this.bbblend=0;
	this.bbscissor_x=.0;
	this.bbscissor_y=.0;
	this.bbscissor_width=.0;
	this.bbscissor_height=.0;
	this.bbmatrixStack=new_number_array(192);
}
function bbgraphicsnew(bbdevice){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<215>";
	dbg_object(this).bbdevice=bbdevice;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<214>";
	var bb=this;
	pop_err();
	return bb;
}
function bbgraphicsnew2(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<212>";
	var bb=this;
	pop_err();
	return bb;
}
var bbgraphicscontext;
function bbgraphicsSetGraphicsContext(bbgc){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<254>";
	bbgraphicscontext=bbgc;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<253>";
	pop_err();
	return 0;
}
var bbinputdevice;
function bbinputSetInputDevice(bbdev){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/input.monkey<38>";
	bbinputdevice=bbdev;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/input.monkey<37>";
	pop_err();
	return 0;
}
var bbaudiodevice;
function bbaudioSetAudioDevice(bbdev){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/audio.monkey<50>";
	bbaudiodevice=bbdev;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/audio.monkey<49>";
	pop_err();
	return 0;
}
var bbappdevice;
var bbexternmyapp;
function bbexternThing(){
	Object.call(this);
	this.bbx=.0;
	this.bby=.0;
	this.bbvx=.0;
	this.bbvy=.0;
}
function bbexternnew2(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<26>";
	var bb=this;
	pop_err();
	return bb;
}
var bbexternall;
bbexternThing.prototype.bbUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<32>";
	this.bbx+=this.bbvx;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<33>";
	this.bby+=this.bbvy;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<34>";
	if(this.bbx<-320.000000){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<34>";
		this.bbx+=640.000000;
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<35>";
	if(this.bbx>320.000000){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<35>";
		this.bbx-=640.000000;
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<36>";
	if(this.bby<-240.000000){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<36>";
		this.bby+=480.000000;
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<37>";
	if(this.bby>240.000000){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<37>";
		this.bby-=480.000000;
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<31>";
	pop_err();
	return 0;
}
bbexternThing.prototype.bbDraw=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<40>";
	pop_err();
	return 0;
}
function bbexternShip(){
	bbexternThing.call(this);
	this.bbname="";
	this.bbspeed=.0;
	this.bblife=0;
	this.bbtarget=null;
	this.bbvan=.0;
	this.bban=.0;
	this.bbpoints=0;
}
bbexternShip.prototype=extend_class(bbexternThing);
var bbexternall2;
function bbexternnew3(bbname){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<64>";
	bbexternnew2.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<65>";
	var bbname2=bbname;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<66>";
	var bbn=0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<67>";
	var bbgo=0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<68>";
	while(!((bbgo)!=0)){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<69>";
		bbgo=1;
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<70>";
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<70>";
		var bb=bbexternall2.bbObjectEnumerator();
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<70>";
		while(bb.bbHasNext()){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<70>";
			var bbs=object_downcast((bb.bbNextObject()),bbexternShip);
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<71>";
			if(dbg_object(bbs).bbname==bbname2){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<72>";
				bbgo=0;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<73>";
				bbn+=1;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<74>";
				bbname2=bbname+String(bbn);
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<78>";
	bbname=bbname2;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<79>";
	dbg_object(this).bbname=bbname;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<80>";
	addPlayer(bbname);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<81>";
	this.bbx=bbrandomRnd2(-320.000000,320.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<82>";
	this.bby=bbrandomRnd2(-240.000000,240.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<83>";
	this.bbspeed=bbrandomRnd2(.2,1.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<84>";
	this.bblife=10;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<85>";
	bbexternall2.bbAddLast(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<86>";
	bbexternall.bbAddLast(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<64>";
	var bb2=this;
	pop_err();
	return bb2;
}
function bbexternnew4(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<45>";
	bbexternnew2.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<45>";
	var bb=this;
	pop_err();
	return bb;
}
bbexternShip.prototype.bbdie=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<165>";
	bbexternall.bbRemove(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<166>";
	bbexternall2.bbRemove(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<167>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<167>";
	var bb=bbexternall2.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<167>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<167>";
		var bbs=object_downcast((bb.bbNextObject()),bbexternShip);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<168>";
		if(dbg_object(bbs).bbtarget==this){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<169>";
			dbg_object(bbs).bbtarget=null;
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<164>";
	pop_err();
	return 0;
}
function bbexternkill(bbname){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<57>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<57>";
	var bb=bbexternall2.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<57>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<57>";
		var bbs=object_downcast((bb.bbNextObject()),bbexternShip);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<58>";
		if(dbg_object(bbs).bbname==bbname){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<59>";
			bbs.bbdie();
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<56>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbshoot=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<142>";
	bbexternnew5.call(new bbexternBullet,this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<141>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<90>";
	this.bbvx*=.99;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<91>";
	this.bbvy*=.99;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<92>";
	this.bbvx-=this.bbx*.00001;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<93>";
	this.bbvy-=this.bby*.00001;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<94>";
	this.bban+=this.bbvan;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<95>";
	this.bbvan*=.9;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<97>";
	bbexternThing.prototype.bbUpdate.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<99>";
	var bbdx=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<99>";
	var bbdy=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<99>";
	var bbd=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<100>";
	var bbclosest=null;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<101>";
	var bbmindist=-1.000000;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<102>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<102>";
	var bb=bbexternall2.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<102>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<102>";
		var bbd2=object_downcast((bb.bbNextObject()),bbexternShip);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<103>";
		if(bbd2!=this){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<104>";
			bbdx=dbg_object(bbd2).bbx-this.bbx;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<105>";
			bbdy=dbg_object(bbd2).bby-this.bby;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<106>";
			bbd=bbdx*bbdx+bbdy*bbdy;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<107>";
			if(bbd<bbmindist || bbmindist==-1.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<108>";
				bbmindist=bbd;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<109>";
				bbclosest=bbd2;
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<113>";
	if(!((this.bbtarget)!=null)){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<114>";
		this.bbtarget=bbclosest;
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<116>";
	if((this.bbtarget)!=null){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<117>";
		bbdx=dbg_object(this.bbtarget).bbx-this.bbx;
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<118>";
		bbdy=dbg_object(this.bbtarget).bby-this.bby;
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<119>";
		bbd=bbdx*bbdx+bbdy*bbdy;
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<120>";
		if(bbd<40000.000000 || bbclosest==this.bbtarget){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<121>";
			var bbdan=(Math.atan2(bbdy,bbdx)*R2D);
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<122>";
			bbdan-=this.bban;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<123>";
			bbdan=(((bbdan)|0) % 360);
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<124>";
			if(bbdan<-180.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<124>";
				bbdan+=360.000000;
			}
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<125>";
			if(bbdan>180.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<125>";
				bbdan-=360.000000;
			}
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<126>";
			if(bbmathAbs2(bbdan)<10.000000 && bbrandomRnd3(10.000000)<1.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<127>";
				this.bbshoot();
			}
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<129>";
			this.bbvan+=bbmathMin2(bbmathAbs2(bbdan/3.000000),3.0)*bbmathSgn2(bbdan)*.2;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<130>";
			var bbdp=Math.cos((bbdan)*D2R);
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<131>";
			if(bbdp>0.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<132>";
				this.bbvx+=Math.cos((this.bban)*D2R)*bbdp*.05*this.bbspeed;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<133>";
				this.bbvy+=Math.sin((this.bban)*D2R)*bbdp*.05*this.bbspeed;
			}
		}else{
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<136>";
			this.bbtarget=null;
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<89>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbDraw=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<175>";
	bbgraphicsPushMatrix();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<176>";
	bbgraphicsTranslate(this.bbx,this.bby);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<177>";
	bbgraphicsRotate(-this.bban);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<178>";
	bbgraphicsDrawCircle(0.000000,0.000000,5.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<179>";
	bbgraphicsDrawLine(0.000000,0.000000,10.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<180>";
	bbgraphicsRotate(-90.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<181>";
	bbgraphicsDrawText(this.bbname,0.000000,0.000000,0.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<182>";
	bbgraphicsPopMatrix();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<174>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbrespawn=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<153>";
	this.bblife=10;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<154>";
	this.bbx=bbrandomRnd2(-320.000000,320.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<155>";
	this.bby=bbrandomRnd2(-240.000000,240.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<156>";
	this.bban=bbrandomRnd3(360.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<152>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbhurt=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<146>";
	this.bblife-=1;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<147>";
	if(this.bblife<0){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<148>";
		this.bbrespawn();
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<145>";
	pop_err();
	return 0;
}
bbexternShip.prototype.bbaddpoint=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<160>";
	this.bbpoints+=1;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<161>";
	setScore(this.bbname,this.bbpoints);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<159>";
	pop_err();
	return 0;
}
function bblistList(){
	Object.call(this);
	this.bb_head=bblistnew4.call(new bblistNode);
}
bblistList.prototype.bbObjectEnumerator=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<78>";
	var bb=bblistnew2.call(new bblistEnumerator,this);
	pop_err();
	return bb;
}
bblistList.prototype.bbAddLast=function(bbdata){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<49>";
	var bb=bblistnew5.call(new bblistNode,this.bb_head,dbg_object(this.bb_head).bb_pred,bbdata);
	pop_err();
	return bb;
}
bblistList.prototype.bbEquals=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<16>";
	var bb=((bblhs==bbrhs)?1:0);
	pop_err();
	return bb;
}
bblistList.prototype.bbRemoveEach=function(bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<58>";
	var bbnode=dbg_object(this.bb_head).bb_succ;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<59>";
	while(bbnode!=this.bb_head){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<60>";
		bbnode=dbg_object(bbnode).bb_succ;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<61>";
		if((this.bbEquals(dbg_object(dbg_object(bbnode).bb_pred).bb_data,bbvalue))!=0){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<61>";
			dbg_object(bbnode).bb_pred.bbRemove();
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<57>";
	pop_err();
	return 0;
}
bblistList.prototype.bbRemove=function(bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<54>";
	this.bbRemoveEach(bbvalue);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<53>";
	pop_err();
	return 0;
}
function bblistnew(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<13>";
	var bb=this;
	pop_err();
	return bb;
}
function bblistEnumerator(){
	Object.call(this);
	this.bb_list=null;
	this.bb_curr=null;
}
function bblistnew2(bblist){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<128>";
	this.bb_list=bblist;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<129>";
	this.bb_curr=dbg_object(dbg_object(bblist).bb_head).bb_succ;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<127>";
	var bb=this;
	pop_err();
	return bb;
}
function bblistnew3(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<125>";
	var bb=this;
	pop_err();
	return bb;
}
bblistEnumerator.prototype.bbHasNext=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<133>";
	var bb=this.bb_curr!=dbg_object(this.bb_list).bb_head;
	pop_err();
	return bb;
}
bblistEnumerator.prototype.bbNextObject=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<137>";
	var bbdata=dbg_object(this.bb_curr).bb_data;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<138>";
	this.bb_curr=dbg_object(this.bb_curr).bb_succ;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<139>";
	pop_err();
	return bbdata;
}
function bblistNode(){
	Object.call(this);
	this.bb_succ=null;
	this.bb_pred=null;
	this.bb_data=null;
}
function bblistnew4(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<95>";
	this.bb_succ=this;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<96>";
	this.bb_pred=this;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<94>";
	var bb=this;
	pop_err();
	return bb;
}
function bblistnew5(bbsucc,bbpred,bbdata){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<101>";
	this.bb_succ=bbsucc;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<102>";
	this.bb_pred=bbpred;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<103>";
	dbg_object(this.bb_succ).bb_pred=this;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<104>";
	dbg_object(this.bb_pred).bb_succ=this;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<105>";
	this.bb_data=bbdata;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<100>";
	var bb=this;
	pop_err();
	return bb;
}
bblistNode.prototype.bbRemove=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<113>";
	dbg_object(this.bb_succ).bb_pred=this.bb_pred;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<114>";
	dbg_object(this.bb_pred).bb_succ=this.bb_succ;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/list.monkey<112>";
	pop_err();
	return 0;
}
var bbrandomSeed;
function bbrandomRnd(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/random.monkey<21>";
	bbrandomSeed=bbrandomSeed*1664525+1013904223|0;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/random.monkey<22>";
	var bb=(((bbrandomSeed/4)|0)&1073741823)/1073741824.000000;
	pop_err();
	return bb;
}
function bbrandomRnd2(bblow,bbhigh){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/random.monkey<30>";
	var bb=bbrandomRnd3(bbhigh-bblow)+bblow;
	pop_err();
	return bb;
}
function bbrandomRnd3(bbrange){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/random.monkey<26>";
	var bb=bbrandomRnd()*bbrange;
	pop_err();
	return bb;
}
function bbexternmakeShip(bbname){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<284>";
	bbexternnew3.call(new bbexternShip,bbname);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<283>";
	pop_err();
	return 0;
}
function bb_Main(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<290>";
	bbexternmyapp=bbexternnew.call(new bbexternTestApp);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<293>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<289>";
	pop_err();
	return 0;
}
function bbresourceResource(){
	Object.call(this);
	this.bbnode=null;
	this.bbrefs=1;
}
function bbresourcenew(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<16>";
	var bb=this;
	pop_err();
	return bb;
}
bbresourceResource.prototype.bbRegister=function(bbtype){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<37>";
	var bblist=object_downcast((bbresourceresources.bbValueForKey(bbboxesnew3.call(new bbboxesStringObject,bbtype))),bblistList);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<38>";
	if(!((bblist)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<39>";
		bblist=bblistnew.call(new bblistList);
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<40>";
		bbresourceresources.bbInsert((bbboxesnew3.call(new bbboxesStringObject,bbtype)),bblist);
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<42>";
	this.bbnode=bblist.bbAddLast(this);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<36>";
	pop_err();
	return 0;
}
bbresourceResource.prototype.bbRetain=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<19>";
	this.bbrefs+=1;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/resource.monkey<18>";
	pop_err();
	return 0;
}
function bbgraphicsImage(){
	bbresourceResource.call(this);
	this.bbsurface=null;
	this.bbwidth=0;
	this.bbheight=0;
	this.bbframes=[];
	this.bbflags=0;
	this.bbtx=.0;
	this.bbty=.0;
	this.bbsource=null;
}
bbgraphicsImage.prototype=extend_class(bbresourceResource);
var bbgraphicsDefaultFlags;
function bbgraphicsnew3(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<60>";
	bbresourcenew.call(this);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<60>";
	var bb=this;
	pop_err();
	return bb;
}
bbgraphicsImage.prototype.bbSetHandle=function(bbtx,bbty){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<105>";
	dbg_object(this).bbtx=bbtx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<106>";
	dbg_object(this).bbty=bbty;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<107>";
	dbg_object(this).bbflags=dbg_object(this).bbflags&-2;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<104>";
	pop_err();
	return 0;
}
bbgraphicsImage.prototype.bbApplyFlags=function(bbiflags){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<174>";
	this.bbflags=bbiflags;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<176>";
	if((this.bbflags&2)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
		var bb=this.bbframes;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
		var bb2=0;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
		while(bb2<bb.length){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
			var bbf=dbg_array(bb,bb2)[bb2];
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<177>";
			bb2=bb2+1;
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<178>";
			dbg_object(bbf).bbx+=1;
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<180>";
		this.bbwidth-=2;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
	if((this.bbflags&4)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
		var bb3=this.bbframes;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
		var bb4=0;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
		while(bb4<bb3.length){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
			var bbf2=dbg_array(bb3,bb4)[bb4];
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
			bb4=bb4+1;
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<185>";
			dbg_object(bbf2).bby+=1;
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<187>";
		this.bbheight-=2;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
	if((this.bbflags&1)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<191>";
		this.bbSetHandle((this.bbwidth)/2.0,(this.bbheight)/2.0);
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<194>";
	if(this.bbframes.length==1 && dbg_object(dbg_array(this.bbframes,0)[0]).bbx==0 && dbg_object(dbg_array(this.bbframes,0)[0]).bby==0 && this.bbwidth==this.bbsurface.Width() && this.bbheight==this.bbsurface.Height()){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<195>";
		this.bbflags|=65536;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<173>";
	pop_err();
	return 0;
}
bbgraphicsImage.prototype.bbLoad=function(bbpath,bbnframes,bbiflags){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<121>";
	this.bbsurface=dbg_object(bbgraphicscontext).bbdevice.LoadSurface(bbpath);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<122>";
	if(!((this.bbsurface)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<122>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<124>";
	this.bbRegister("mojo.graphics.Image");
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<126>";
	this.bbwidth=((this.bbsurface.Width()/bbnframes)|0);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<127>";
	this.bbheight=this.bbsurface.Height();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<129>";
	this.bbframes=new_object_array(bbnframes);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<131>";
	for(var bbi=0;bbi<bbnframes;bbi=bbi+1){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<132>";
		dbg_array(this.bbframes,bbi)[bbi]=bbgraphicsnew4.call(new bbgraphicsFrame,bbi*this.bbwidth,0)
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<135>";
	this.bbApplyFlags(bbiflags);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<137>";
	var bb=this;
	pop_err();
	return bb;
}
bbgraphicsImage.prototype.bbGrab=function(bbx,bby,bbiwidth,bbiheight,bbnframes,bbiflags,bbsource){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<142>";
	bbsource.bbRetain();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<143>";
	dbg_object(this).bbsource=bbsource;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<144>";
	this.bbsurface=dbg_object(bbsource).bbsurface;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<146>";
	this.bbRegister("mojo.graphics.Image");
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<148>";
	this.bbwidth=bbiwidth;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<149>";
	this.bbheight=bbiheight;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<151>";
	this.bbframes=new_object_array(bbnframes);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<153>";
	var bbix=bbx+dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bbx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<154>";
	var bbiy=bby+dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bby;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<156>";
	for(var bbi=0;bbi<bbnframes;bbi=bbi+1){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<157>";
		if(bbix+this.bbwidth>dbg_object(bbsource).bbwidth){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<158>";
			bbix=dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bbx;
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<159>";
			bbiy+=this.bbheight;
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<161>";
		if(bbix+this.bbwidth>dbg_object(bbsource).bbwidth || bbiy+this.bbheight>dbg_object(bbsource).bbheight){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<162>";
			error("Image frame outside surface");
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<164>";
		dbg_array(this.bbframes,bbi)[bbi]=bbgraphicsnew4.call(new bbgraphicsFrame,bbix,bbiy)
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<165>";
		bbix+=this.bbwidth;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<168>";
	this.bbApplyFlags(bbiflags);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<170>";
	var bb=this;
	pop_err();
	return bb;
}
bbgraphicsImage.prototype.bbGrabImage=function(bbx,bby,bbwidth,bbheight,bbframes,bbflags){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<100>";
	if(dbg_object(this).bbframes.length!=1){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<100>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<101>";
	var bb=(bbgraphicsnew3.call(new bbgraphicsImage)).bbGrab(bbx,bby,bbwidth,bbheight,bbframes,bbflags,this);
	pop_err();
	return bb;
}
bbgraphicsImage.prototype.bbWidth=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<72>";
	pop_err();
	return this.bbwidth;
}
bbgraphicsImage.prototype.bbHeight=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<76>";
	pop_err();
	return this.bbheight;
}
bbgraphicsImage.prototype.bbFrames=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<84>";
	var bb=this.bbframes.length;
	pop_err();
	return bb;
}
function bbboxesStringObject(){
	Object.call(this);
	this.bbvalue="";
}
function bbboxesnew(bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<59>";
	dbg_object(this).bbvalue=String(bbvalue);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<58>";
	var bb=this;
	pop_err();
	return bb;
}
function bbboxesnew2(bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<63>";
	dbg_object(this).bbvalue=String(bbvalue);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<62>";
	var bb=this;
	pop_err();
	return bb;
}
function bbboxesnew3(bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<67>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<66>";
	var bb=this;
	pop_err();
	return bb;
}
function bbboxesnew4(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/boxes.monkey<55>";
	var bb=this;
	pop_err();
	return bb;
}
function bbmapMap(){
	Object.call(this);
	this.bbroot=null;
}
function bbmapnew(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<13>";
	var bb=this;
	pop_err();
	return bb;
}
bbmapMap.prototype.bbCompare=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<99>";
	pop_err();
	return 0;
}
bbmapMap.prototype.bbFindNode=function(bbkey){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<124>";
	var bbnode=this.bbroot;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<126>";
	while((bbnode)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<127>";
		var bbcmp=this.bbCompare(bbkey,dbg_object(bbnode).bbkey);
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<128>";
		if(bbcmp>0){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<129>";
			bbnode=dbg_object(bbnode).bbright;
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<130>";
			if(bbcmp<0){
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<131>";
				bbnode=dbg_object(bbnode).bbleft;
			}else{
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<133>";
				pop_err();
				return bbnode;
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<136>";
	pop_err();
	return bbnode;
}
bbmapMap.prototype.bbGet=function(bbkey){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<65>";
	var bbnode=this.bbFindNode(bbkey);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<66>";
	if((bbnode)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<66>";
		var bb=dbg_object(bbnode).bbvalue;
		pop_err();
		return bb;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<64>";
	pop_err();
	return null;
}
bbmapMap.prototype.bbValueForKey=function(bbkey){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<95>";
	var bb=this.bbGet(bbkey);
	pop_err();
	return bb;
}
bbmapMap.prototype.bbRotateLeft=function(bbnode){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<218>";
	var bbchild=dbg_object(bbnode).bbright;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<219>";
	dbg_object(bbnode).bbright=dbg_object(bbchild).bbleft;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<220>";
	if((dbg_object(bbchild).bbleft)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<221>";
		dbg_object(dbg_object(bbchild).bbleft).bbparent=bbnode;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<223>";
	dbg_object(bbchild).bbparent=dbg_object(bbnode).bbparent;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<224>";
	if((dbg_object(bbnode).bbparent)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<225>";
		if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbleft){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<226>";
			dbg_object(dbg_object(bbnode).bbparent).bbleft=bbchild;
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<228>";
			dbg_object(dbg_object(bbnode).bbparent).bbright=bbchild;
		}
	}else{
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<231>";
		this.bbroot=bbchild;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<233>";
	dbg_object(bbchild).bbleft=bbnode;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<234>";
	dbg_object(bbnode).bbparent=bbchild;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<217>";
	pop_err();
	return 0;
}
bbmapMap.prototype.bbRotateRight=function(bbnode){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<238>";
	var bbchild=dbg_object(bbnode).bbleft;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<239>";
	dbg_object(bbnode).bbleft=dbg_object(bbchild).bbright;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<240>";
	if((dbg_object(bbchild).bbright)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<241>";
		dbg_object(dbg_object(bbchild).bbright).bbparent=bbnode;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<243>";
	dbg_object(bbchild).bbparent=dbg_object(bbnode).bbparent;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<244>";
	if((dbg_object(bbnode).bbparent)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<245>";
		if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbright){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<246>";
			dbg_object(dbg_object(bbnode).bbparent).bbright=bbchild;
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<248>";
			dbg_object(dbg_object(bbnode).bbparent).bbleft=bbchild;
		}
	}else{
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<251>";
		this.bbroot=bbchild;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<253>";
	dbg_object(bbchild).bbright=bbnode;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<254>";
	dbg_object(bbnode).bbparent=bbchild;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<237>";
	pop_err();
	return 0;
}
bbmapMap.prototype.bbInsertFixup=function(bbnode){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<179>";
	while(((dbg_object(bbnode).bbparent)!=null) && dbg_object(dbg_object(bbnode).bbparent).bbcolor==-1 && ((dbg_object(dbg_object(bbnode).bbparent).bbparent)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<180>";
		if(dbg_object(bbnode).bbparent==dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbleft){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<181>";
			var bbuncle=dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbright;
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<182>";
			if(((bbuncle)!=null) && dbg_object(bbuncle).bbcolor==-1){
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<183>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<184>";
				dbg_object(bbuncle).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<185>";
				dbg_object(dbg_object(bbuncle).bbparent).bbcolor=-1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<186>";
				bbnode=dbg_object(bbuncle).bbparent;
			}else{
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<188>";
				if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbright){
					err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<189>";
					bbnode=dbg_object(bbnode).bbparent;
					err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<190>";
					this.bbRotateLeft(bbnode);
				}
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<192>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<193>";
				dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbcolor=-1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<194>";
				this.bbRotateRight(dbg_object(dbg_object(bbnode).bbparent).bbparent);
			}
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<197>";
			var bbuncle2=dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbleft;
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<198>";
			if(((bbuncle2)!=null) && dbg_object(bbuncle2).bbcolor==-1){
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<199>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<200>";
				dbg_object(bbuncle2).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<201>";
				dbg_object(dbg_object(bbuncle2).bbparent).bbcolor=-1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<202>";
				bbnode=dbg_object(bbuncle2).bbparent;
			}else{
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<204>";
				if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbleft){
					err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<205>";
					bbnode=dbg_object(bbnode).bbparent;
					err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<206>";
					this.bbRotateRight(bbnode);
				}
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<208>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<209>";
				dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbcolor=-1;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<210>";
				this.bbRotateLeft(dbg_object(dbg_object(bbnode).bbparent).bbparent);
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<214>";
	dbg_object(this.bbroot).bbcolor=1;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<178>";
	pop_err();
	return 0;
}
bbmapMap.prototype.bbSet=function(bbkey,bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<32>";
	var bbnode=this.bbroot;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<33>";
	var bbparent=null;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<33>";
	var bbcmp=0;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<35>";
	while((bbnode)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<36>";
		bbparent=bbnode;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<37>";
		bbcmp=this.bbCompare(bbkey,dbg_object(bbnode).bbkey);
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<38>";
		if(bbcmp>0){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<39>";
			bbnode=dbg_object(bbnode).bbright;
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<40>";
			if(bbcmp<0){
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<41>";
				bbnode=dbg_object(bbnode).bbleft;
			}else{
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<43>";
				dbg_object(bbnode).bbvalue=bbvalue;
				err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<44>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<48>";
	bbnode=bbmapnew3.call(new bbmapNode,bbkey,bbvalue,-1,bbparent);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<50>";
	if(!((bbparent)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<51>";
		this.bbroot=bbnode;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<52>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<55>";
	if(bbcmp>0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<56>";
		dbg_object(bbparent).bbright=bbnode;
	}else{
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<58>";
		dbg_object(bbparent).bbleft=bbnode;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<61>";
	this.bbInsertFixup(bbnode);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<31>";
	pop_err();
	return 0;
}
bbmapMap.prototype.bbInsert=function(bbkey,bbvalue){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<90>";
	var bb=this.bbSet(bbkey,bbvalue);
	pop_err();
	return bb;
}
function bbmapStringMap(){
	bbmapMap.call(this);
}
bbmapStringMap.prototype=extend_class(bbmapMap);
function bbmapnew2(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<523>";
	bbmapnew.call(this);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<523>";
	var bb=this;
	pop_err();
	return bb;
}
bbmapStringMap.prototype.bbCompare=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<526>";
	var bbl=dbg_object(object_downcast((bblhs),bbboxesStringObject)).bbvalue;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<527>";
	var bbr=dbg_object(object_downcast((bbrhs),bbboxesStringObject)).bbvalue;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<528>";
	if(bbl<bbr){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<528>";
		pop_err();
		return -1;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<529>";
	var bb=((bbl>bbr)?1:0);
	pop_err();
	return bb;
}
var bbresourceresources;
function bbmapNode(){
	Object.call(this);
	this.bbkey=null;
	this.bbright=null;
	this.bbleft=null;
	this.bbvalue=null;
	this.bbcolor=0;
	this.bbparent=null;
}
function bbmapnew3(bbkey,bbvalue,bbcolor,bbparent){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<331>";
	dbg_object(this).bbkey=bbkey;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<332>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<333>";
	dbg_object(this).bbcolor=bbcolor;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<334>";
	dbg_object(this).bbparent=bbparent;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<330>";
	var bb=this;
	pop_err();
	return bb;
}
function bbmapnew4(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/map.monkey<328>";
	var bb=this;
	pop_err();
	return bb;
}
function bbgraphicsFrame(){
	Object.call(this);
	this.bbx=0;
	this.bby=0;
}
function bbgraphicsnew4(bbx,bby){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<52>";
	dbg_object(this).bbx=bbx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<53>";
	dbg_object(this).bby=bby;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<51>";
	var bb=this;
	pop_err();
	return bb;
}
function bbgraphicsnew5(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<47>";
	var bb=this;
	pop_err();
	return bb;
}
function bbgraphicsLoadImage(bbpath,bbframeCount,bbflags){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<280>";
	var bb=(bbgraphicsnew3.call(new bbgraphicsImage)).bbLoad(bbpath,bbframeCount,bbflags);
	pop_err();
	return bb;
}
function bbgraphicsLoadImage2(bbpath,bbframeWidth,bbframeHeight,bbframeCount,bbflags){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<284>";
	var bbatlas=(bbgraphicsnew3.call(new bbgraphicsImage)).bbLoad(bbpath,1,0);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<285>";
	if((bbatlas)!=null){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<285>";
		var bb=bbatlas.bbGrabImage(0,0,bbframeWidth,bbframeHeight,bbframeCount,bbflags);
		pop_err();
		return bb;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<283>";
	pop_err();
	return null;
}
function bbgraphicsSetFont(bbfont,bbfirstChar){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<536>";
	if(!((bbfont)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<537>";
		if(!((dbg_object(bbgraphicscontext).bbdefaultFont)!=null)){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<538>";
			dbg_object(bbgraphicscontext).bbdefaultFont=bbgraphicsLoadImage("mojo_font.png",96,2);
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<540>";
		bbfont=dbg_object(bbgraphicscontext).bbdefaultFont;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<541>";
		bbfirstChar=32;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<543>";
	dbg_object(bbgraphicscontext).bbfont=bbfont;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<544>";
	dbg_object(bbgraphicscontext).bbfirstChar=bbfirstChar;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<535>";
	pop_err();
	return 0;
}
var bbgraphicsrenderDevice;
function bbgraphicsSetMatrix(bbix,bbiy,bbjx,bbjy,bbtx,bbty){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<334>";
	dbg_object(bbgraphicscontext).bbix=bbix;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<335>";
	dbg_object(bbgraphicscontext).bbiy=bbiy;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<336>";
	dbg_object(bbgraphicscontext).bbjx=bbjx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<337>";
	dbg_object(bbgraphicscontext).bbjy=bbjy;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<338>";
	dbg_object(bbgraphicscontext).bbtx=bbtx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<339>";
	dbg_object(bbgraphicscontext).bbty=bbty;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<340>";
	dbg_object(bbgraphicscontext).bbtformed=((bbix!=1.000000 || bbiy!=0.000000 || bbjx!=0.000000 || bbjy!=1.000000 || bbtx!=0.000000 || bbty!=0.000000)?1:0);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<341>";
	dbg_object(bbgraphicscontext).bbmatDirty=1;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<333>";
	pop_err();
	return 0;
}
function bbgraphicsSetMatrix2(bbm){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<330>";
	bbgraphicsSetMatrix(dbg_array(bbm,0)[0],dbg_array(bbm,1)[1],dbg_array(bbm,2)[2],dbg_array(bbm,3)[3],dbg_array(bbm,4)[4],dbg_array(bbm,5)[5]);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<329>";
	pop_err();
	return 0;
}
function bbgraphicsSetColor(bbr,bbg,bbb){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<289>";
	dbg_object(bbgraphicscontext).bbcolor_r=bbr;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<290>";
	dbg_object(bbgraphicscontext).bbcolor_g=bbg;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<291>";
	dbg_object(bbgraphicscontext).bbcolor_b=bbb;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<292>";
	dbg_object(bbgraphicscontext).bbdevice.SetColor(bbr,bbg,bbb);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<288>";
	pop_err();
	return 0;
}
function bbgraphicsSetAlpha(bbalpha){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<300>";
	dbg_object(bbgraphicscontext).bbalpha=bbalpha;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<301>";
	dbg_object(bbgraphicscontext).bbdevice.SetAlpha(bbalpha);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<299>";
	pop_err();
	return 0;
}
function bbgraphicsSetBlend(bbblend){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<309>";
	dbg_object(bbgraphicscontext).bbblend=bbblend;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<310>";
	dbg_object(bbgraphicscontext).bbdevice.SetBlend(bbblend);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<308>";
	pop_err();
	return 0;
}
function bbgraphicsDeviceWidth(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<272>";
	var bb=dbg_object(bbgraphicscontext).bbdevice.Width();
	pop_err();
	return bb;
}
function bbgraphicsDeviceHeight(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<276>";
	var bb=dbg_object(bbgraphicscontext).bbdevice.Height();
	pop_err();
	return bb;
}
function bbgraphicsSetScissor(bbx,bby,bbwidth,bbheight){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<318>";
	dbg_object(bbgraphicscontext).bbscissor_x=bbx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<319>";
	dbg_object(bbgraphicscontext).bbscissor_y=bby;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<320>";
	dbg_object(bbgraphicscontext).bbscissor_width=bbwidth;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<321>";
	dbg_object(bbgraphicscontext).bbscissor_height=bbheight;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<322>";
	dbg_object(bbgraphicscontext).bbdevice.SetScissor(((bbx)|0),((bby)|0),((bbwidth)|0),((bbheight)|0));
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<317>";
	pop_err();
	return 0;
}
function bbgraphicsBeginRender(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<258>";
	bbgraphicsrenderDevice=dbg_object(bbgraphicscontext).bbdevice;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<259>";
	dbg_object(bbgraphicscontext).bbmatrixSp=0;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<260>";
	bbgraphicsSetMatrix(1.000000,0.000000,0.000000,1.000000,0.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<261>";
	bbgraphicsSetColor(255.000000,255.000000,255.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<262>";
	bbgraphicsSetAlpha(1.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<263>";
	bbgraphicsSetBlend(0);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<264>";
	bbgraphicsSetScissor(0.000000,0.000000,(bbgraphicsDeviceWidth()),(bbgraphicsDeviceHeight()));
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<257>";
	pop_err();
	return 0;
}
function bbgraphicsEndRender(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<268>";
	bbgraphicsrenderDevice=null;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<267>";
	pop_err();
	return 0;
}
function bbappMillisecs(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<145>";
	var bb=bbappdevice.MilliSecs();
	pop_err();
	return bb;
}
function bbappSetUpdateRate(bbhertz){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/app.monkey<141>";
	var bb=bbappdevice.SetUpdateRate(bbhertz);
	pop_err();
	return bb;
}
function bbexternBullet(){
	bbexternThing.call(this);
	this.bbowner=null;
	this.bblife=0;
}
bbexternBullet.prototype=extend_class(bbexternThing);
var bbexternall3;
function bbexternnew5(bbowner){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<192>";
	bbexternnew2.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<193>";
	bbexternall.bbAddLast(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<194>";
	bbexternall3.bbAddLast(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<195>";
	dbg_object(this).bbowner=bbowner;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<196>";
	dbg_object(this).bbx=dbg_object(bbowner).bbx;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<197>";
	dbg_object(this).bby=dbg_object(bbowner).bby;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<198>";
	dbg_object(this).bbvx=Math.cos((dbg_object(bbowner).bban)*D2R)*5.000000+dbg_object(bbowner).bbvx;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<199>";
	dbg_object(this).bbvy=Math.sin((dbg_object(bbowner).bban)*D2R)*5.000000+dbg_object(bbowner).bbvy;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<192>";
	var bb=this;
	pop_err();
	return bb;
}
function bbexternnew6(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<186>";
	bbexternnew2.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<186>";
	var bb=this;
	pop_err();
	return bb;
}
bbexternBullet.prototype.bbdie=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<235>";
	bbexternall3.bbRemove(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<236>";
	bbexternall.bbRemove(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<234>";
	pop_err();
	return 0;
}
bbexternBullet.prototype.bbdoCollisions=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<212>";
	var bbdx=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<212>";
	var bbdy=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<212>";
	var bbd=.0;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<213>";
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<213>";
	var bb=bbexternall2.bbObjectEnumerator();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<213>";
	while(bb.bbHasNext()){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<213>";
		var bbs=object_downcast((bb.bbNextObject()),bbexternShip);
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<214>";
		if(bbs!=this.bbowner){
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<215>";
			bbdx=dbg_object(bbs).bbx-this.bbx;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<216>";
			bbdy=dbg_object(bbs).bby-this.bby;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<217>";
			bbd=bbdx*bbdx+bbdy*bbdy;
			err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<218>";
			if(bbd<25.000000){
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<219>";
				dbg_object(bbs).bbvx+=this.bbvx*.1;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<220>";
				dbg_object(bbs).bbvy+=this.bbvy*.1;
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<221>";
				bbs.bbhurt();
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<222>";
				this.bbowner.bbaddpoint();
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<223>";
				this.bbdie();
				err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<224>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<229>";
	if(this.bbx<-320.000000 || this.bbx>320.000000 || this.bby<-240.000000 || this.bby>240.000000){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<230>";
		this.bbdie();
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<211>";
	pop_err();
	return 0;
}
bbexternBullet.prototype.bbUpdate=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<203>";
	bbexternThing.prototype.bbUpdate.call(this);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<204>";
	this.bblife+=1;
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<205>";
	if(this.bblife>100){
		err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<206>";
		this.bbdie();
	}
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<208>";
	this.bbdoCollisions();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<202>";
	pop_err();
	return 0;
}
bbexternBullet.prototype.bbDraw=function(){
	push_err();
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<240>";
	bbgraphicsDrawRect(this.bbx,this.bby,1.000000,1.000000);
	err_info="C:/Users/Christian/Monkey/warpy/extern/extern.monkey<239>";
	pop_err();
	return 0;
}
function bbgraphicsDebugRenderDevice(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<245>";
	if(!((bbgraphicsrenderDevice)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<245>";
		error("Rendering operations can only be performed inside OnRender");
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<244>";
	pop_err();
	return 0;
}
function bbgraphicsCls(bbr,bbg,bbb){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<389>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<391>";
	bbgraphicsrenderDevice.Cls(bbr,bbg,bbb);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<387>";
	pop_err();
	return 0;
}
function bbgraphicsPushMatrix(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<349>";
	var bbsp=dbg_object(bbgraphicscontext).bbmatrixSp;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<350>";
	var bb=bbsp+0;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb)[bb]=dbg_object(bbgraphicscontext).bbix
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<351>";
	var bb2=bbsp+1;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb2)[bb2]=dbg_object(bbgraphicscontext).bbiy
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<352>";
	var bb3=bbsp+2;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb3)[bb3]=dbg_object(bbgraphicscontext).bbjx
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<353>";
	var bb4=bbsp+3;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb4)[bb4]=dbg_object(bbgraphicscontext).bbjy
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<354>";
	var bb5=bbsp+4;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb5)[bb5]=dbg_object(bbgraphicscontext).bbtx
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<355>";
	var bb6=bbsp+5;
	dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb6)[bb6]=dbg_object(bbgraphicscontext).bbty
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<356>";
	dbg_object(bbgraphicscontext).bbmatrixSp=bbsp+6;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<348>";
	pop_err();
	return 0;
}
function bbgraphicsTransform(bbix,bbiy,bbjx,bbjy,bbtx,bbty){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<366>";
	var bbix2=bbix*dbg_object(bbgraphicscontext).bbix+bbiy*dbg_object(bbgraphicscontext).bbjx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<367>";
	var bbiy2=bbix*dbg_object(bbgraphicscontext).bbiy+bbiy*dbg_object(bbgraphicscontext).bbjy;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<368>";
	var bbjx2=bbjx*dbg_object(bbgraphicscontext).bbix+bbjy*dbg_object(bbgraphicscontext).bbjx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<369>";
	var bbjy2=bbjx*dbg_object(bbgraphicscontext).bbiy+bbjy*dbg_object(bbgraphicscontext).bbjy;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<370>";
	var bbtx2=bbtx*dbg_object(bbgraphicscontext).bbix+bbty*dbg_object(bbgraphicscontext).bbjx+dbg_object(bbgraphicscontext).bbtx;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<371>";
	var bbty2=bbtx*dbg_object(bbgraphicscontext).bbiy+bbty*dbg_object(bbgraphicscontext).bbjy+dbg_object(bbgraphicscontext).bbty;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<372>";
	bbgraphicsSetMatrix(bbix2,bbiy2,bbjx2,bbjy2,bbtx2,bbty2);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<365>";
	pop_err();
	return 0;
}
function bbgraphicsTransform2(bbcoords){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<581>";
	var bbout=new_number_array(bbcoords.length);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<582>";
	for(var bbi=0;bbi<bbcoords.length-1;bbi=bbi+2){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<583>";
		var bbx=dbg_array(bbcoords,bbi)[bbi];
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<583>";
		var bb=bbi+1;
		var bby=dbg_array(bbcoords,bb)[bb];
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<584>";
		dbg_array(bbout,bbi)[bbi]=bbx*dbg_object(bbgraphicscontext).bbix+bby*dbg_object(bbgraphicscontext).bbjx+dbg_object(bbgraphicscontext).bbtx
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<585>";
		var bb2=bbi+1;
		dbg_array(bbout,bb2)[bb2]=bbx*dbg_object(bbgraphicscontext).bbiy+bby*dbg_object(bbgraphicscontext).bbjy+dbg_object(bbgraphicscontext).bbty
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<587>";
	pop_err();
	return bbout;
}
function bbgraphicsTranslate(bbx,bby){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<376>";
	bbgraphicsTransform(1.000000,0.000000,0.000000,1.000000,bbx,bby);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<375>";
	pop_err();
	return 0;
}
function bbgraphicsPopMatrix(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<360>";
	var bbsp=dbg_object(bbgraphicscontext).bbmatrixSp-6;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<361>";
	var bb=bbsp+0;
	var bb2=bbsp+1;
	var bb3=bbsp+2;
	var bb4=bbsp+3;
	var bb5=bbsp+4;
	var bb6=bbsp+5;
	bbgraphicsSetMatrix(dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb)[bb],dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb2)[bb2],dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb3)[bb3],dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb4)[bb4],dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb5)[bb5],dbg_array(dbg_object(bbgraphicscontext).bbmatrixStack,bb6)[bb6]);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<362>";
	dbg_object(bbgraphicscontext).bbmatrixSp=bbsp;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<359>";
	pop_err();
	return 0;
}
function bbmathAbs(bbx){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<45>";
	if(bbx>=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<45>";
		pop_err();
		return bbx;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<46>";
	var bb=-bbx;
	pop_err();
	return bb;
}
function bbmathAbs2(bbx){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<72>";
	if(bbx>=0.000000){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<72>";
		pop_err();
		return bbx;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<73>";
	var bb=-bbx;
	pop_err();
	return bb;
}
function bbmathMin(bbx,bby){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<50>";
	if(bbx<bby){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<50>";
		pop_err();
		return bbx;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<51>";
	pop_err();
	return bby;
}
function bbmathMin2(bbx,bby){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<77>";
	if(bbx<bby){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<77>";
		pop_err();
		return bbx;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<78>";
	pop_err();
	return bby;
}
function bbmathSgn(bbx){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<40>";
	if(bbx<0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<40>";
		pop_err();
		return -1;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<41>";
	var bb=((bbx>0)?1:0);
	pop_err();
	return bb;
}
function bbmathSgn2(bbx){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<66>";
	if(bbx<0.000000){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<66>";
		pop_err();
		return -1.000000;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<67>";
	if(bbx>0.000000){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<67>";
		pop_err();
		return 1.000000;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/monkey/math.monkey<68>";
	pop_err();
	return 0.000000;
}
function bbgraphicsRotate(bbangle){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<384>";
	bbgraphicsTransform(Math.cos((bbangle)*D2R),-Math.sin((bbangle)*D2R),Math.sin((bbangle)*D2R),Math.cos((bbangle)*D2R),0.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<383>";
	pop_err();
	return 0;
}
function bbgraphicsValidateMatrix(){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<238>";
	if((dbg_object(bbgraphicscontext).bbmatDirty)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<239>";
		dbg_object(bbgraphicscontext).bbdevice.SetMatrix(dbg_object(bbgraphicscontext).bbix,dbg_object(bbgraphicscontext).bbiy,dbg_object(bbgraphicscontext).bbjx,dbg_object(bbgraphicscontext).bbjy,dbg_object(bbgraphicscontext).bbtx,dbg_object(bbgraphicscontext).bbty);
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<240>";
		dbg_object(bbgraphicscontext).bbmatDirty=0;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<237>";
	pop_err();
	return 0;
}
function bbgraphicsDrawCircle(bbx,bby,bbr){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<420>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<422>";
	bbgraphicsValidateMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<423>";
	bbgraphicsrenderDevice.DrawOval(bbx-bbr,bby-bbr,bbr*2.000000,bbr*2.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<418>";
	pop_err();
	return 0;
}
function bbgraphicsDrawLine(bbx1,bby1,bbx2,bby2){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<404>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<406>";
	bbgraphicsValidateMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<407>";
	bbgraphicsrenderDevice.DrawLine(bbx1,bby1,bbx2,bby2);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<402>";
	pop_err();
	return 0;
}
function bbgraphicsDrawImage(bbimage,bbx,bby,bbframe){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<436>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<438>";
	var bbf=dbg_array(dbg_object(bbimage).bbframes,bbframe)[bbframe];
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<440>";
	if((dbg_object(bbgraphicscontext).bbtformed)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<441>";
		bbgraphicsPushMatrix();
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<443>";
		bbgraphicsTranslate(bbx-dbg_object(bbimage).bbtx,bby-dbg_object(bbimage).bbty);
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<445>";
		bbgraphicsValidateMatrix();
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<447>";
		if((dbg_object(bbimage).bbflags&65536)!=0){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<448>";
			dbg_object(bbgraphicscontext).bbdevice.DrawSurface(dbg_object(bbimage).bbsurface,0.000000,0.000000);
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<450>";
			dbg_object(bbgraphicscontext).bbdevice.DrawSurface2(dbg_object(bbimage).bbsurface,0.000000,0.000000,dbg_object(bbf).bbx,dbg_object(bbf).bby,dbg_object(bbimage).bbwidth,dbg_object(bbimage).bbheight);
		}
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<453>";
		bbgraphicsPopMatrix();
	}else{
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<455>";
		bbgraphicsValidateMatrix();
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<457>";
		if((dbg_object(bbimage).bbflags&65536)!=0){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<458>";
			dbg_object(bbgraphicscontext).bbdevice.DrawSurface(dbg_object(bbimage).bbsurface,bbx-dbg_object(bbimage).bbtx,bby-dbg_object(bbimage).bbty);
		}else{
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<460>";
			dbg_object(bbgraphicscontext).bbdevice.DrawSurface2(dbg_object(bbimage).bbsurface,bbx-dbg_object(bbimage).bbtx,bby-dbg_object(bbimage).bbty,dbg_object(bbf).bbx,dbg_object(bbf).bby,dbg_object(bbimage).bbwidth,dbg_object(bbimage).bbheight);
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<434>";
	pop_err();
	return 0;
}
function bbgraphicsScale(bbx,bby){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<380>";
	bbgraphicsTransform(bbx,0.000000,0.000000,bby,0.000000,0.000000);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<379>";
	pop_err();
	return 0;
}
function bbgraphicsDrawImage2(bbimage,bbx,bby,bbrotation,bbscaleX,bbscaleY,bbframe){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<467>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<469>";
	var bbf=dbg_array(dbg_object(bbimage).bbframes,bbframe)[bbframe];
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<471>";
	bbgraphicsPushMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<473>";
	bbgraphicsTranslate(bbx,bby);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<474>";
	bbgraphicsRotate(bbrotation);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<475>";
	bbgraphicsScale(bbscaleX,bbscaleY);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<476>";
	bbgraphicsTranslate(-dbg_object(bbimage).bbtx,-dbg_object(bbimage).bbty);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<478>";
	bbgraphicsValidateMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<480>";
	if((dbg_object(bbimage).bbflags&65536)!=0){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<481>";
		dbg_object(bbgraphicscontext).bbdevice.DrawSurface(dbg_object(bbimage).bbsurface,0.000000,0.000000);
	}else{
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<483>";
		dbg_object(bbgraphicscontext).bbdevice.DrawSurface2(dbg_object(bbimage).bbsurface,0.000000,0.000000,dbg_object(bbf).bbx,dbg_object(bbf).bby,dbg_object(bbimage).bbwidth,dbg_object(bbimage).bbheight);
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<486>";
	bbgraphicsPopMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<465>";
	pop_err();
	return 0;
}
function bbgraphicsDrawText(bbtext,bbx,bby,bbxalign,bbyalign){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<561>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<563>";
	if(!((dbg_object(bbgraphicscontext).bbfont)!=null)){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<563>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<565>";
	var bbw=dbg_object(bbgraphicscontext).bbfont.bbWidth();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<566>";
	var bbh=dbg_object(bbgraphicscontext).bbfont.bbHeight();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<568>";
	bbx-=(bbw*bbtext.length)*bbxalign;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<569>";
	bby-=(bbh)*bbyalign;
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<571>";
	for(var bbi=0;bbi<bbtext.length;bbi=bbi+1){
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<572>";
		var bbch=bbtext.charCodeAt(bbi)-dbg_object(bbgraphicscontext).bbfirstChar;
		err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<573>";
		if(bbch>=0 && bbch<dbg_object(bbgraphicscontext).bbfont.bbFrames()){
			err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<574>";
			bbgraphicsDrawImage(dbg_object(bbgraphicscontext).bbfont,bbx+(bbi*bbw),bby,bbch);
		}
	}
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<559>";
	pop_err();
	return 0;
}
function bbgraphicsDrawRect(bbx,bby,bbw,bbh){
	push_err();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<396>";
	bbgraphicsDebugRenderDevice();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<398>";
	bbgraphicsValidateMatrix();
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<399>";
	bbgraphicsrenderDevice.DrawRect(bbx,bby,bbw,bbh);
	err_info="C:/Users/Christian/Monkey/Monkey/modules/mojo/graphics.monkey<394>";
	pop_err();
	return 0;
}
function bb_Init(){
	bbgraphicscontext=null;
	bbinputdevice=null;
	bbaudiodevice=null;
	bbappdevice=null;
	bbexternmyapp=null;
	bbexternall2=null;
	bbrandomSeed=1234;
	bbexternall=null;
	bbgraphicsDefaultFlags=0;
	bbresourceresources=bbmapnew2.call(new bbmapStringMap);
	bbgraphicsrenderDevice=null;
	bbexternall3=null;
}
//${TRANSCODE_END}

//This overrides print in 'std.lang/lang.js'
//

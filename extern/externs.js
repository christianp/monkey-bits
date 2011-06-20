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




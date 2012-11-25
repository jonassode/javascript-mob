
var mobs = {
	mob: function(){
		var object = jsmob.mob();
		// Default Values
		object.mass = 5; // Number of turns it takes to burn the object
		object.burnable = true; // Can this object burn
		object.burn = false; // Is  it burning right now?
		object.temperature = 0; // Used for controling the burning ( objects over 5 starts to burn )

		object.postact = function(){
			if ( this.burn == true && this.cell.get_item('fire') == undefined ){
				this.cell.set_item('fire',mobs.fire());	
			}
		}

		return object;
	},

	fire: function(){ 
		var object = mobs.mob();
		object.image = 'fire_small.png';
		object.burn = true;
		object.name = 'fire';
		object.act = function(){
			if ( this.burn == true ){
				var directions = this.cell.directions();
				for (var i=0;i<directions.length;i++){
					var direction = directions[i];
					if ( direction != undefined ){
						var object = mobs.heat();
						object.new = true;
						direction.set_item('heat', object);
						object.act();
					}
				}
			}
		}

		return object;
	},

	heat: function(){
		var object = mobs.mob();
		object.image = 'heat.png';
		object.speed = 100;
		object.name = 'heat';
		object.act = function(){

			$.each(this.cell.items(),function() {
				this.temperature++;
				if ( this.temperature >= 5 ){
					this.burn = true;
				}
			});

			this.destroy();
		}
		return object;
	},

	tree: function(){
		var object = mobs.mob();
		object.image = 'tree.png';
		object.name = 'tree';
		return object;
	},

	monster: function(){
		var object = mobs.mob();
		object.type = 'monster';
		object.faction = 'monster';
		object.act = function(){
			var faction = this.faction;
			var seen_items = this.look();
			$.each(seen_items, function(){
				if ( this.faction != faction ){
					console.log('Grr. Incorrect faction. I am '+faction+' and it is ' + this.faction);
				}
			});
		}
		return object;
	},

	drake: function(){
		var object = mobs.monster();
		object.image = 'drake.png';
		object.name = 'drake';
		object.faction = 'drakes';
		return object;
	},

	slug: function(){
		var object = mobs.monster();
		object.image = 'elephant_slug.png';
		object.name = 'elephant slug';
		object.faction = 'slugs';
		return object;
	},

	centaur: function(){
		var object = mobs.monster();
		object.speed = 100;
		object.image = 'centaur.png';
		object.name = 'centaur';
		return object;
	},


	block: function(){
		var object = mobs.mob();
		object.image = 'floor.png';
		object.name = 'block';
		object.blocking = true;
		return object;
	}
}

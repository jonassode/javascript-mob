
jslos.blocker_values.push("#");

var jsmob = {

	list: new Array(),

	update_time_units: function(time_passed){
		// Make all objects reduce passed time
		$.each(jsmob.list,function() {
			this.time_units -= time_passed;
		});
	},

	who_acts_next: function(){
		var actor = undefined;
		$.each(jsmob.list,function() {
			if ( actor == undefined || this.time_units < actor.time_units ){
				actor = this;
			}
		});
		return actor;
	},

	mob: function(){
		var object = {}
		object.row = undefined;
		object.col = undefined;
		object.vision = 3;
		object.speed = 5;
		object.blocking = false;
		object.time_units = object.speed;
		object.name = "mob";

		jsmob.list.push(object);
		object.index = jsmob.list.length - 1;

		object.act = function(){
			
		}
		object.postact = function(){
			
		}
		object.destroy = function(){
			this.cell.remove_item(this.key);
			jsmob.destroy(this);
		}
		object.look = function(){
			var matrix = this.cell.matrix.create_vos_matrix();
			// Add blocking elements to matrix
			$.each(jsmob.list,function() {
				if ( this.blocking == true ){
					matrix[this.row][this.col] = '#';
				}
			});
			var center = {row: this.row, col: this.col };
			var losmatrix = jslos.calculate_line_of_sight(matrix, center, this.vision);
			var seen_items = new Array();
			// Loop through all visible cells and add what you see to list;
                	for( row = 0; row < losmatrix.length; row++) {
                        	for( col = 0; col < losmatrix[row].length; col++) {
					var cell = this.cell.matrix.get_cell(row,col);
					if ( losmatrix[row][col] == "1" && cell.has_item() ) {
						$.each(cell.items(),function() {
							seen_items.push(this);
						});
					}
				};
			};
			return seen_items;
		}		
		return object;
	},

	destroy: function(object){
		var index = undefined;
		for ( var i = 0; i < jsmob.list.length; i++){
			if ( jsmob.list[i] === object){
				index = i;
			}
		}
		if ( index != undefined ){
			jsmob.list.splice(index, 1);
		}
	},

	acts: function(){
		// Get Actor
		var actor = undefined;
		var stop = false;

		while(actor == undefined || stop == false ){
			actor = this.who_acts_next();

			// Update Actor Units
			this.update_time_units(actor.time_units);

			// Act & Postact
			if ( actor.player_controlled != true ){
				actor.act();
			} else {
				stop = true;
			}
			actor.postact();

			// Add Time
			actor.time_units = actor.speed;
		}
	},


}






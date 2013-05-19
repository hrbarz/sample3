function get_hash_tags_text(text){
	
	var a, b, c, d;

	a = new RegExp('#([^\\s]*)','g');

	b = text;

	d = [];


	c = b.match(a);

	if( c !== null ){

		c = _.uniq(c);
		
		for (var i = 0; i < c.length; i++) {
			if(c[i].length > 1){
				d.push(c[i].replace('#',''));
			}
		};

	}

	return d;
}	

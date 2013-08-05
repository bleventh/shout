var db = require('../lib/db');

var DESIRED_SQUARE_POPULATION = 4;

resizeGrid = function(lon, lat) {
	console.log(db.recGridTable.toJSON());
	var query = db.recGridTable.where().lte("min_lon", lon).gt("max_lon", lon).lte("min_lat", lat).gt("max_lat", lat).findAll();
	splitGrid(query);
	console.log(db.recGridTable.toJSON());
	var query2 = db.recGridTable.where().lte("min_lon", lon).gt("max_lon", lon).lte("min_lat", lat).gt("max_lat", lat).findAll();
	joinGrid(query2);
	console.log(db.recGridTable.toJSON());

	if (query.length() === 1) {
	 	var pop = query[0].users.length();
	 	if (pop > (2 * DESIRED_SQUARE_POPULATION)) splitGrid(query[0]);
	 	else if (pop < (.5 * DESIRED_SQUARE_POPULATION)) joinGrid(query[0]);
	}
	else console.log("nope");
}

splitGrid = function(squery) {
	var square = squery[0];
	var mid_lat = (square.min_lat + square.max_lat)/2;
	var mid_lon = (square.min_lon + square.max_lon)/2;
	var boundaries = {  0: [square.min_lon, mid_lon, mid_lat, square.max_lat, []], 1: [mid_lon, square.max_lon, mid_lat, square.max_lat, []], 2: [square.min_lon, mid_lon, square.min_lat, mid_lat, []], 3: [mid_lon, square.max_lon, square.min_lat, mid_lat, []]};
	var newGIDs = createGIDs(square.gid);
	for (var i = square.users.length; i > 0; i--) {
		if (square.users[i].lon >= mid_lon) {
			if (square.users[i].lat >= mid_lat) boundaries[1][4].push(square.users[i]);
			else boundaries[3][4].push(square.users[i]);
		}
		else {
			if (square.users[i].lat >= mid_lat) boundaries[0][4].push(square.users[i]);
			else boundaries[2][4].push(square.users[i]);
		}
	}
	for (var i = 3; i >= 0; i --) {
		db.recGridTable.add({ gid : newGIDs[i], min_lon : boundaries[i][0], max_lon : boundaries[i][1], min_lat : boundaries[i][2], max_lat : boundaries[i][3] , users : boundaries[i][4] });
	}
	squery.clear();
}

joinGrid = function(squery) {
	var square = squery[0];
	var superGID = getSuperGID(square.gid);
	var subGIDs = createGIDs(superGID);
	var mila = 90, mala = -90, milo = 180, malo = -180, totalPeople = 0;
	var sq_rows = []
	for (var i = 3; i >= 0; i--) {
		var query = db.recGridTable.where().eq("gid", subGIDs[i]).findAll();
		if (query.length() != 1)  {
			console.log("multiple subGIDs"); 
			break;
		}
		sq_rows.push(query);
		mila = Math.min(mila, query[0].min_lat);
		mala = Math.max(mala, query[0].max_lat);
		milo = Math.min(milo, query[0].min_lon);
		malo = Math.max(malo, query[0].max_lon);
		totalPeople += query[0].users.length();
	}
	if (totalPeople < .5 * DESIRED_SQUARE_POPULATION) {
		var usrs = []
		for (var i = 3; i >= 0; i--) {
			usrs.concat(sq_rows[i][0].users);
		}
		db.recGridTable.add({ gid : superGID, min_lon : milo, max_lon : malo, min_lat : mila, max_lat : mala, users : usrs});
		for (var i = 3; i >= 0; i--) {
			sq_rows[i].clear();
		}
	} 
}

createGIDs = function(gid) {
	var offset = 0;
	while ((gid & 4) != 4 ) {
		gid >>= 2;
		offset += 2;
	}
	gid = (gid ^ 5) << offset;
	return new Array(gid, gid ^ (2 << offset), gid ^ (4 << offset), gid ^ (6 << offset));
}

getSuperGID = function(gid) {
	var offset = 2;
	while ((gid & 1) != 1) {
		gid >>= 2;
		offset += 2;
	}
	gid >>= 2;
	gid |= 1;
	return gid << offset;
}


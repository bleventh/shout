
gridTable = {	"square" : "int", 
		"min_lat" : "float", 
		"max_lat" : "float",
		"min_long" : "float",
		"max_long" : "float",
		"users" : {	"aid" : "int", "lat" : "float", "long" : "float" }
			}
gridTable.add({ square : 0x100000000000000, max_long : 180.0, min_long : -180.0, max_lat : 180, min_lat : 0, users : {} })

# Called when user makes shout/requests shouts/users added

def resizeGrid(account_id, long, lat):
	query = gridTable.where()
				.le("min_lat", lat)
				.gt("max_lat", lat)
				.le("min_long", long)
				.gt("max_long", long)
				.findAll()
	pop = query.users.length()
	if pop > 2*DESIRED_GRID_POPULATION:
		splitGrid(query)
	else if pop < .5* DESIRED_GRID_POPULATION:
		joinGrid(query)

def splitGrid(query):
	#make boundaries
	mid_lat = query.max_lat - query.min_lat
	mid_long = query.max_long - query.min_long
	boundaries = { 	0 : (mid_lat, query.max_lat, mid_long, query.max_long),
					1 : (mid_lat, query.max_lat, query.min_long, mid_long),
					2 : (query.min_lat, min_lat, mid_long, query.max_long),
					3 : (query.min_lat, min_lat, query.min_long, mid_long)
				}
	new_squares = createGridSquares(query.square)
	user_squares = {0 : [], 1 : [], 2 : [], 3 : []}
	for user in query.users:
		if user.lat >= mid_lat:
			if user.long >= mid_long: user_squares[0].append(user)
			else: user_squares[1].append(user)
		else
			if user.long >= mid_long: user_squares[2].append(user)
			else: user_squares[3].append(user)

	for i in xrange(len(new_squares)):
		gridTable.add({ square : new_squares[i], boundaries[i][0], boundaries[i][1], boundaries[i][2], boundaries[i][3], users : user_squares[i] })
	gridTable.remove("quare", query.square)

def joinGrid(query):
	super_square = getSuperSquare(query.square);
	sub_squares = createGridSquares(super_square)
	longitudes = []
	latitudes = []
	total_people = []
	square_rows = [gridTable.where().eq("square", sq).findAll()[0] for sq in sub_squares]
	for sr in square_rows:
		longitutes += [sr.min_long, sr.max_long]
		latitudes += [sr.min_lat, sr.max_lat]
		total_people += [sr.users.length()]
	if total_people < .5*DESIRED_GRID_POPULATION:
		row = gridTable.add({ square : super_square, min_lat : min(latitudes), max_lat : max(latitudes), min_long : min(longitudes), max_long : max(longitudes), users : {} });
		for sr in square_row:
			row.users.extend(sr.users)
			sr.clear()

def getSuperSquare(bi):
	offset  = 2
	while bi % 2 != 1:
		bi >>= 1
		offset += 1
	bi >>= 2
	bi |= 1
	return bi << offset
		
def createGridSquares(bi):
	temp_square = bi
	offset = -3
	while temp_square % 2 != 1:
		temp_square >>= 1
		offset += 1
	base = bi ^ (5 << offset)
	return [base] + [base ^ (i << offset + 1) for i in xrange(1, 4)]

##################################################
##	Density stuff
##################################################

def earthArea(long0, long1, lat0, lat1):
	def latrad(lat0, lat1):
		return cos(pi*lat0/180)-cos(pi*lat1/180)

	def longrad(long0, long1):
		return pi/180*(long1-long0)

	return 6370**2*latrad(lat0, lat1)*longrad(long0, long1)

def resizeGrid1(account_id, long, lat):
	query = gridTable.where()
				.le("min_lat", lat)
				.gt("max_lat", lat)
				.le("min_long", long)
				.gt("max_long", long)
				.findAll()
	area = earthArea(query.min_lat, query.max_lat, query.min_long, query.max_long)
	grid_density = query.users.length()/area
	if grid_density > 2*DESIRED_GRID_DENSITY:
		splitGrid(query)
	else if grid_density < .5*DESIRED_GRID_DENSITY:
		joinGrid(query)

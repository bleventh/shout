
gridTable = {	"bin" : "int", 
				"min_lat" : "float", 
				"max_lat" : "float",
			 	"min_long" : "float",
				"max_long" : "float",
				"users" : {	"aid" : "int", "lat" : "float", "long" : "float" }
			}
gridTable.add({ bin : 0x100000000000000, max_long : 180.0, min_long : -180.0, max_lat : 180, min_lat : 0, users : {} })

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
	newbins = createGridBins(query.bin)
	userbins = {0 : [], 1 : [], 2 : [], 3 : []}
	for user in query.users:
		if user.lat >= mid_lat:
			if user.long >= mid_long: userbins[0].append(user)
			else: userbins[1].append(user)
		else
			if user.long >= mid_long: userbins[2].append(user)
			else: userbins[3].append(user)

	for i in xrange(len(newbins)):
		gridTable.add({ bin : newbins[i], boundaries[i][0], boundaries[i][1], boundaries[i][2], boundaries[i][3], users : userbins[i] })
	gridTable.remove("bin", query.bin)

		
def createGridBins(bin):
	tempbin = bin
	offset = -3
	while tempbin %2 != 1:
		tempbin >>= 1
		offset += 1
	base = bin ^ (5 << offset)
	res = []
	mask1 = mask2 = 1 << offset
	for (j = 2; j > 0; j --):
		for (k = 2; k > 0; k--):
			res.append(base ^ (mask1 << j) ^ (mask2 << k))
	return res


##################################################
##	Density stuff
##################################################

def earthArea(long0, long1, lat0, lat1):
	def latrad(lat0, lat1):
		return cos(pi*lat0/180)-cos(pi*lat1/180)

	def longrad(long0, long1):
		return pi/180*(long1-long0)

	return 6370**2*latrad(lat0, lat1)*longrad(long0, long1)

# Called when user makes shout/requests shouts/users added
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

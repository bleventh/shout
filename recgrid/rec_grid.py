from numpy import random
import time

DESIRED_GRID_POPULATION = 5

def resizeGrid(lon, lat):
	for sq_id in grid:
		if lon >= grid[sq_id][0] and lon < grid[sq_id][1] and lat >= grid[sq_id][2] and lat < grid[sq_id][3]:
			break
	containing_sq = grid[sq_id]
	population = len(containing_sq[4])
	print "Population", population
	if population > 2*DESIRED_GRID_POPULATION:
		splitGrid(sq_id, containing_sq)
	elif population < .5*DESIRED_GRID_POPULATION:
		joinGrid(sq_id, containing_sq)

def splitGrid(sq_id, super_sq):
	mid_lat = (super_sq[1] - super_sq[0])/2
	mid_long = (super_sq[3] - super_sq[2])/2
	boundaries = { 0 : (mid_lat, super_sq[1], mid_long, super_sq[3]),
			1: (mid_lat, super_sq[1], super_sq[2], mid_long),
			2: (super_sq[0], mid_lat, mid_long, super_sq[3]),
			3: (super_sq[0], mid_lat, super_sq[2], mid_long) }
	new_squares = createSubSquares(sq_id)
	user_squares = { 0 : [], 1 : [], 2 : [], 3 : [] }
	for user in super_sq[4]:
		if user[1] >= mid_lat:
			if user[2] >= mid_long: user_squares[0].append(user)
			else: user_squares[1].append(user)
		else:
			if user[2] >= mid_long: user_squares[2].append(user)
			else: user_squares[3].append(user)
	for i in xrange(len(new_squares)):
		grid[new_squares[i]] = (boundaries[i][0], boundaries[i][1], boundaries[i][2], boundaries[i][3], [])
	del grid[sq_id]

def joinGrid(sq_id, sub_sq):
	pass

def createSubSquares(sq_id):
	q = sq_id >> 2
	return [(sq_id << 1) - q, sq_id + q, sq_id -q, (sq_id >> 1) - q]

def getSuperSquare(sq_id):
	offset = 2
	while sq_id & 1 != 1:
		sq_id >>= 2
		offset += 2
	sq_id >>= 2
	sq_id |= 1
	return sq_id << offset

def addUser(user):
	for sq_id in grid:
		square = grid[sq_id]
		if user[0] >= square[0] and user[0] < square[1] and user[1] >= square[2] and user[1] < square[3]:
			square[4].append(user)
			resizeGrid(user[1], user[2])
			break

if __name__ == "__main__":
	grid = {0x10000000 : (0.0, 8.0, 0.0, 8.0, []) }
	i = 1
	while True:
		raw_input("Hit enter for new point")
		x, y = (8*random.random(), 8*random.random())
		user = (i, x, y)
		i += 1
		addUser(user)
		print grid

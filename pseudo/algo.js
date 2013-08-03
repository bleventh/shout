/*
Think of this file like psuedocode
*/

var INIT_RADIUS;
var MAGIC_DENSITY;
var LENIENCY_PERCENTAGE;
var MIN_RADIUS;
var SCALING_PERCENT;
var TIME_ADJUST;
var UPPER_ACCEPT = MAGIC_DENSITY + MAGIC_DENSITY*LENIENCY_PERCENTAGE;
var LOWER_ACCEPT = MAGIC_DENSITY - MAGIC_DENSITY*LENIENCY_PERCENTAGE;
var TIME_CONSTANT;
var SCORE_SCALE;

function getInitialHorizon(shout) {
	var radius = INIT_RADIUS;
	var shoutsInArea = getAllShouts(shout.location, radius);
	var density = shoutsInArea/((radius^2)*PI);
	while ((density > UPPER_ACCEPT || density < LOWER_ACCEPT) && radius > MIN_RADIUS) {
		if (density > UPPER_ACCEPT) {
			radius*=SCALING_PERCENT;
			shoutsInArea = getAllShouts(shout.location, radius);
			density = shoutsInArea/((radius^2)*PI);
		} else if (density < LOWER_ACCEPT) {
			radius/=SCALING_PERCENT;
			shoutsInArea = getAllShouts(shout.location, radius);
			density = shoutsInArea/((radius^2)*PI);
		}
	}
	if (radius < MIN_RADIUS) radius = MIN_RADIUS;
	shout.oldRadius = radius;
	shout.oldScore = 0; 
	return radius;	
}

function updateHorizon(shout){
	var score = shout.amps - shout.muffles;
	var scoreDelta = score - shout.oldScore;
	var timeSinceLast = System.timeMillis() - shout.oldTime;
	var radius = shout.oldRadius*(1 + (scoreDelta*SCORE_ADJUST) - (timeSincePost*TIME_ADJUST));
	if (radius < MIN_RADIUS) radius = MIN_RADIUS;
	return radius;	
}

function getHotRank(shout) {
	var timeSincePost = System.timeMillis()-shout.getcreationTime();
	var popularityScore = shout.amps - shout.muffles;
	var sign;
	if (popularityScore > 0) sign = 1;
	else if (popularityScore < 0) sign = -1;
	else sign = 0; 
	var maxVal;
	if (popularityScore != 0) maxVal = abs(popularityScore);
	else maxVal = 0; 
	var order = log(maxVal) + (sign*timeSincePost)/(TIME_CONSTANT)
} 

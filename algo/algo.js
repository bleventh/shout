/*
Think of this file like psuedocode
*/

var INIT_RADIUS;
var MAGIC_NUM_PEOPLE;
var LENIENCY_PERCENTAGE;
var MIN_RADIUS;
var SCALING_PERCENT;
var TIME_ADJUST;
var UPPER_ACCEPT = MAGIC_NUM_PEOPLE + MAGIC_NUM_PEOPLE*LENIENCY_PERCENTAGE;
var LOWER_ACCEPT = MAGIC_NUM_PEOPLE - MAGIC_NUM_PEOPLE*LENIENCY_PERCENTAGE;
var TIME_CONSTANT;
var SCORE_SCALE;

function getInitialHorizon(shout) {
	var radius = INIT_RADIUS;
	var shoutsInArea = getAllShouts(shout.location, radius);
	while ((shoutsInArea > UPPER_ACCEPT || shoutsInArea < LOWER_ACCEPT) && radius > MIN_RADIUS) {
		if (shoutsInArea > UPPER_ACCEPT) {
			radius*=SCALING_PERCENT;
			shoutsInArea = getAllShouts(shout.location, radius);
		} else if (shoutsInArea < LOWER_ACCEPT) {
			radius/=SCALING_PERCENT;
			shoutsInArea = getAllShouts(shout.location, radius);
		}
	}
	if (radius < MIN_RADIUS) radius = MIN_RADIUS;
	return radius;
}

function updateRadius(shout) {
	var score = shout.amps - shout.muffles;
	var scoreDelta = score - shout.oldScore;
	var timeSinceLast = System.timeMillis() - shout.oldTime;
	var radius = shout.oldRadius*(1 + (scoreDelta*SCORE_ADJUST) - (timeSincePost*TIME_ADJUST));
	if (radius < MIN_RADIUS) radius = MIN_RADIUS;
	return radius;	
}
			
function getHotRank(shout) {
	var timeSincePost = shout.timeSincePost;
	var popScore = shout.amps - shout.muffles;
	var sign; 
	if (popScore > 0) sign = 1;
	else if (popScore < 0) sign = -1;
	else sign = 0;
	var maxVal;
	if (popScore != 0) maxVal = Math.abs(popScore);
	else maxVal = 1;
	var hotRank = Math.log(maxVal) + (sign*timeSincePost)/(TIME_CONSTANT);
	return hotRank; // for debug
} 

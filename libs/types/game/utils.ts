export enum Direction {
	NONE,
	LEFT,
	RIGHT,
	TOP,
	BOTTOM,
};

export type Coordinates = {
	x: number,
	y: number,
}

export enum Axis {
	X,
	Y,
};

export type Rectangle = {
	center: Coordinates,
	height_d_2: number, // height divided by two
	width_d_2: number,  // width  divided by two
};

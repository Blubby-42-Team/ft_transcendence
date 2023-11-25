export function getStyle(style: number) {
	switch (style){
		case 1:
			return {
				normal: "rounded border-2 ",
				unselected: "border-pink-500 bg-pink-500 hover:bg-pink-500 hover:bg-opacity-60 hover:border-pink-500 disabled:bg-pink-500 disabled:border-pink-500",
				selected: "bg-pink-500 border-pink-500 disabled:bg-pink-500 disabled:border-pink-500",
			};
		case 2:
			return {
				normal: "border-2",
				unselected: "border-pink-500 bg-pink-500 hover:bg-pink-500 hover:bg-opacity-60 hover:border-pink-500",
				selected: "",
			};
		case 0:
		default:
			return {
				normal: "",
				selected: "",
				unselected: "",
			};
	}
}

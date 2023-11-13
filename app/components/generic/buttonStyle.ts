export function getStyle(style: number) {
	switch (style){
		case 1:
			return {
				normal: "rounded border-2 ",
				unselected: "border-color1 bg-color1 hover:bg-accent-color hover:bg-opacity-60 hover:border-accent-color disabled:bg-background3 disabled:border-background2",
				selected: "bg-accent-color border-accent-color disabled:bg-accent-color disabled:border-accent-color",
			};
		case 2:
			return {
				normal: "border-2",
				unselected: "border-color2 bg-color2 hover:bg-accent-color hover:bg-opacity-60 hover:border-accent-color",
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

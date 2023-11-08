export function getStyle(style: number) {
	switch (style){
		case 1:
			return {
				normal: "rounded border-2 disabled:bg-background3 disabled:border-background2 hover:bg-accent-color hover:bg-opacity-60 hover:border-accent-color",
				unselected: "border-color1 bg-color1",
				selected: "bg-accent-color bg-opacity-15 border-accent-color",
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

export function getStyle(style: number) {
	switch (style){
		case 1:
			return {
				normal: "text-text-light rounded hover:bg-color2",
				unselected: "bg-color1 disabled:bg-color3 disabled:hover:bg-color3",
				selected: "bg-accent1 disabled:bg-accent2 disabled:hover:bg-accent2",
			};
		case 2:
			return {
				normal: "text-text hover:text-text-light hover:bg-color2",
				unselected: "disabled:bg-color3 disabled:hover:bg-color3",
				selected: "bg-accent1 disabled:bg-accent2 disabled:hover:bg-accent2",
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

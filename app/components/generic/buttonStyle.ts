export function getStyle(style: number) {
	switch (style){
		case 1:
			return {
				normal: "text-text-light rounded hover:bg-button-hover",
				unselected: "bg-button disabled:bg-button-dis disabled:hover:bg-button-dis",
				selected: "bg-button-sel disabled:bg-button-sel-dis disabled:hover:bg-button-sel-dis",
			};
		case 2:
			return {
				normal: "text-text hover:text-text-light hover:bg-button-hover",
				unselected: " disabled:bg-button-dis disabled:hover:bg-button-dis",
				selected: "bg-button-sel disabled:bg-button-sel-dis disabled:hover:bg-button-sel-dis",
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

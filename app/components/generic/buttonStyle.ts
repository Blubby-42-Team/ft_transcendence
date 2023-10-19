export function getStyle(style: number): string {
	switch (style){
		case 1:
			return "rounded border-2 border-color1 bg-color1 hover:bg-accent-color hover:bg-opacity-60 hover:border-accent-color";
		case 2:
			return "border-2 border-color2 bg-color2 hover:bg-accent-color hover:bg-opacity-60 hover:border-accent-color";
		case 0:
		default:
			return "";
	}
}
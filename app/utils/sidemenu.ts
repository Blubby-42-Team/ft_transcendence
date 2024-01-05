export function getPositionForSideMenu(
	button: DOMRect,
	menu: DOMRect,
	direction: "left" | "right" | "top" | "bottom" | "vertical" | "horizontal",
	alignDirection: "left" | "right" | "top" | "bottom" | "middle"
){
	let res = {
		x: 0,
		y: 0,
	};
	
	switch (direction) {
		case 'vertical':
		case 'bottom':
		case 'top':
			switch (alignDirection) {
				case 'right':	res.x = (button.left < window.innerWidth - menu.width ? button.left : window.innerWidth - menu.width); break;
				case 'left':	res.x = (button.left + button.width - menu.width > 0 ? res.x = button.left + button.width - menu.width : 0); break;
				case 'middle':	res.x = button.left + button.width / 2 - menu.width / 2; break;
				default: break;
			}
			break;
		case 'horizontal':
		case 'right':
		case 'left':
			switch (alignDirection) {
				case 'bottom':	res.y = (button.top < window.innerHeight - menu.height ? button.top : window.innerHeight - menu.height); break;
				case 'top':		res.y = (button.top + button.height - menu.height > 0 ? res.x = button.top + button.height - menu.height : 0); break;
				case 'middle':	res.y = button.top + button.height / 2 - menu.height / 2; break;
				default: break;
			}
		default:
			break;
	}

	switch (direction) {
		case 'vertical':	res.y = (2 * button.top + button.height < window.innerHeight ? button.top + button.height : button.top - menu.height); break;
		case 'bottom':		res.y = button.top + button.height; break;
		case 'top':			res.y = button.top - menu.height; break;
		case 'horizontal':	res.x = (2 * button.left + button.width < window.innerWidth ? button.left + button.width : button.left - menu.width); break;
		case 'right':		res.x = button.left + button.width; break;
		case 'left':		res.x = button.left - menu.width; break;
		default: break;
	}

	return res;
}
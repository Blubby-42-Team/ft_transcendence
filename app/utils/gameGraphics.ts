export class GraphicEngine {
	public continueLoop = false;
	public state: gameStateType;
	public screen: screenData = {
		delta: {
			x: 0,
			y: 0,
		},
		width: 0,
		height: 0,
	}

	constructor(
		public canvasParentId: string,
		public theme: gameTheme,
		public getState: () => gameStateType,
		public onLoop: (ctx: CanvasRenderingContext2D, screen: screenData, gameState: gameStateType) => void
	){
		this.state = this.getState();
		console.log(this.state)
		for (const textKey in theme){
			this.loadTexture((theme as any)[textKey]);
		}
	}

	private updateSize() {
		const canvas = document.getElementById(this.canvasParentId);
		if (!canvas){
			return ;
		}
		if (canvas.offsetHeight >= this.state.gameArea.height_d_2 / this.state.gameArea.width_d_2 * canvas.offsetWidth) {
			this.screen.width = canvas.offsetWidth - 2;
			this.screen.height = canvas.offsetWidth * this.state.gameArea.height_d_2 / this.state.gameArea.width_d_2 - 2;
		}
		else {
			this.screen.width = canvas.offsetHeight * this.state.gameArea.width_d_2 / this.state.gameArea.height_d_2 - 2;
			this.screen.height = canvas.offsetHeight - 2;
		}
		this.screen.delta.x = this.screen.width / (this.state.gameArea.width_d_2 * 2);
		this.screen.delta.y = this.screen.height / (this.state.gameArea.height_d_2 * 2);
	}

	public start(){
		console.log('Graphic Engine Start')
		this.continueLoop = true;

		const tis = this;

		function loop(){
			let ctx = document.querySelector("canvas")?.getContext("2d");
			tis.state = tis.getState();
	
			if (!ctx || !tis.state){
				window.requestAnimationFrame(loop);
				return ;
			}
	
			tis.updateSize();
			tis.onLoop(ctx, tis.screen, tis.state);
	
			if (tis.continueLoop){
				window.requestAnimationFrame(loop);
			}
		}

		window.requestAnimationFrame(loop);
	}

	public stop(){
		this.continueLoop = false;
		console.log('Graphic Engine Stop')
	}

	public drawGameOver(
		ctx: CanvasRenderingContext2D,
		player: number,
	){
		// Draw Background
		this.drawRectTexture(ctx, 0, 0, screen.width, screen.height, this.theme.background)
	
		ctx.fillStyle = this.theme.fontColor;
		ctx.font = `${this.screen.delta.x * 100}px Arial`;
		ctx.fillText(`   GAME OVER`, this.screen.delta.x * 100, this.screen.delta.x * 310);
		ctx.fillText(`   PLAYER ${player} WINS!`, this.screen.delta.x * 100, this.screen.delta.x * 410);
	}

	public drawGame(
		ctx: CanvasRenderingContext2D,
	){
		// Draw Background
		this.drawRectTexture(ctx, 0, 0, screen.width, screen.height, this.theme.background)
	
		// Draw Ball
		this.drawGameElement(ctx, this.theme.ball, this.state.ball);
	
		this.drawScore(ctx);
		
		// Draw Players
		if (this.state.player_left.active && !this.state.player_left.eleminated){
			this.drawGameElement(ctx, this.theme.player_left, this.state.player_left as Rectangle);
		}
		if (this.state.player_right.active && !this.state.player_right.eleminated){
			this.drawGameElement(ctx, this.theme.player_right, this.state.player_right as Rectangle);
		}
		if (this.state.player_top.active && !this.state.player_top.eleminated){
			this.drawGameElement(ctx, this.theme.player_top, this.state.player_top as Rectangle);
		}
		if (this.state.player_bottom.active && !this.state.player_bottom.eleminated){
			this.drawGameElement(ctx, this.theme.player_bottom, this.state.player_bottom as Rectangle);
		}
	
		// Draw Obstacles
		for (const obstacleKey in this.state.obstacles){
			if (!this.state.obstacles[obstacleKey].hidden){
				this.drawGameElement(ctx, (this.theme as any)?.[obstacleKey] ?? { type: 'color', color: 'purple' }, this.state.obstacles[obstacleKey]);
			}
		}
	}

	private loadTexture(text: gameTexture){
		if (text.type === 'image'){
			text.image = new Image();
			text.image.src = text.imageSrc;
		}
	}
	
	private drawScore(
		ctx: CanvasRenderingContext2D,
	){
		ctx.fillStyle = this.theme.fontColor;
		ctx.font = `${4 * this.screen.delta.y}px Arial`;
		if (this.state.player_bottom.active){
			ctx.fillText(`${this.state.player_bottom.score}`, screen.width * 0.48, screen.height * 0.59);
		}
		if (this.state.player_top.active){
			ctx.fillText(`${this.state.player_top.score}`, screen.width * 0.48, screen.height * 0.459);
		}
		if (this.state.player_left.active){
			ctx.fillText(`${this.state.player_left.score}`, screen.width * 0.42, screen.height * 0.525);
		}
		if (this.state.player_right.active){
			ctx.fillText(`${this.state.player_right.score}`, screen.width * 0.54, screen.height * 0.525);
		}
	}
	
	private drawRectTexture(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		l: number,
		text: gameTexture,
	){
		ctx.beginPath();
		if (text.type === 'color'){
			ctx.fillStyle = text.color;
			ctx.rect(x, y, w, l);
		}
		else if (text.type === 'image'){
			if (!text.image){
				return ;
			}
			ctx.drawImage(text.image, x, y, w, l);
		}
		ctx.fill();
	}
	
	private drawGameElement(
		ctx: CanvasRenderingContext2D,
		text: gameTexture,
		rec: Rectangle,
	){
		this.drawRectTexture(
			ctx,
			this.screen.width / 2 + (rec.center.x - rec.width_d_2) * this.screen.delta.x,
			this.screen.height / 2 + (rec.center.y - rec.height_d_2) * this.screen.delta.y,
			rec.width_d_2 * 2 * this.screen.delta.x,
			rec.height_d_2 * 2 * this.screen.delta.x,
			text,
		);
	}
}
class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'hStartScene' })
	}

	create() {
		this.add.text( 150, 250, 'Click to Play!', {fill: '#000000', fontSize: '20px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('hStartScene')
			this.scene.start('hGameScene')
			console.log('Game Loaded')
		})
	}
}
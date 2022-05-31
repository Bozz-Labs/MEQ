class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
		this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png');
		this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png');
		this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
		this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
	}
	
	create() {
		gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);

		const platforms = this.physics.add.staticGroup();

		platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();

		gameState.scoreText = this.add.text(20, 485, 'Megawatt Hours: 0', { fontSize: '15px', fill: '#000000' });
    
        gameState.housesPoweredText = this.add.text(20, 450, '0 Houses powered for a year', { fontSize: '15px', fill: '#000000' });

		gameState.player.setCollideWorldBounds(true);

		this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();

		const bugs = this.physics.add.group();

		const bugList = ['bug1', 'bug2', 'bug3']

		const bugGen = () => {
			const xCoord = Math.random() * 640
			let randomBug = bugList[Math.floor(Math.random() * 3)]
			bugs.create(xCoord, 10, randomBug)
		}

		const bugGenLoop = this.time.addEvent({
			delay: 100,
			callback: bugGen,
			callbackScope: this,
			loop: true,
		});

		this.physics.add.collider(bugs, platforms, function (bug) {
			bug.destroy();
			gameState.score += 10;
			gamestate.housesPowered += 1;
			gameState.scoreText.setText(`Megawatt Hours: ${gameState.score}`);
			gameState.housesPoweredText.setText(`${gameState.housesPowered} houses powered for a year`);
		})

		this.physics.add.collider(gameState.player, bugs, () => {
			bugGenLoop.destroy();
			this.physics.pause();
			this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
			this.add.text(160, 270, 'Click To Restart', { fontSize: '15px', fill: '#000000' })	

			this.input.on('pointerup', () => {
				gameState.score = 0;
				gamestate.housesPowered = 0;
				this.scene.restart();
				console.log('Game Reset')
			});
		});
	}

	update() {
		if (gameState.cursors.left.isDown) {
			gameState.player.setVelocityX(-160);
		} else if (gameState.cursors.right.isDown) {
			gameState.player.setVelocityX(160);
		} else {
			gameState.player.setVelocityX(0);
		}
	}
}
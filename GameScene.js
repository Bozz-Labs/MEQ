const facts = [
	"Canada produces an average of 4,596,724.82 barrels of crude oil a day!",
	"hydro power and wind turbines are almost the same! The only diffrence is how we get the rotor to move!",
	"Ontario has no coal burning power plants"
  ];
  
  const randomFact = facts[Math.floor(Math.random()*facts.length)];


class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' })
	}

	preload() {
		this.load.image('bolt', 'https://i.postimg.cc/KYHNh8cJ/Lightning-bolt.png');
		this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
		this.load.image('Henry', 'https://i.postimg.cc/05JB7fSW-/Henry-The-stickman-unsized-2-10.png');
	}
	
	create() {
		gameState.player = this.physics.add.sprite(225, 450, 'Henry').setScale(.5);

		const platforms = this.physics.add.staticGroup();

		platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();

		gameState.scoreText = this.add.text(20, 485, 'Megawatt Hours: 0', { fontSize: '15px', fill: '#000000' });
		
		gameState.housesPoweredText = this.add.text(20, 450, '0 Houses powered for a year', { fontSize: '15px', fill: '#000000' });

		gameState.player.setCollideWorldBounds(true);

		this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();

		const bolts = this.physics.add.group();

		const boltList = ['bolt']
		
		const boltGen = () => {
			const xCoord = Math.random() * 450
			let randomBolt = boltList[Math.floor(Math.random() * 1)]
			bolts.create(xCoord, 10, randomBolt)
		}

		const boltGenLoop = this.time.addEvent({
			delay: 100,
			callback: boltGen,
			callbackScope: this,
			loop: true,
		});

		this.physics.add.collider(bolts, platforms, function (bolt) {
			bolt.destroy();
			gameState.score += 10;
			gameState.housesPowered += 1;
			gameState.scoreText.setText(`Megawatt Hours: ${gameState.score}`);
			gameState.housesPoweredText.setText(`${gameState.housesPowered} houses powered for a year`);
			console.log('Entity Killed')
		})

		this.physics.add.collider(gameState.player, bolts, () => {
			boltGenLoop.destroy();
			this.physics.pause();
			this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
			this.add.text(160, 270, 'Click To Restart', { fontSize: '15px', fill: '#000000' })	
			console.log('Player Entity killed')
			console.log('Game Stopped')
			if (confirm(`Did you know that ${randomFact}? Click OK to recieve a diffrent fact later. Click cancel to continue playing.`)) {
				// OK
				window.location.reload();
			  } else {
				// Cancel
				console.log('Canceled Refresh')
			  }

			this.input.on('pointerup', () => {
				gameState.score = 0;
				gameState.housesPowered = 0;
				this.scene.restart();
				console.log('Game Reset')
			});
		});
	}

	update() {
		if (gameState.cursors.left.isDown) {
			gameState.player.setVelocityX(-160);
			console.log('Set player velocityX to -160')
		} else if (gameState.cursors.right.isDown) {
			gameState.player.setVelocityX(160);
			console.log('Set player velocityX to 160');
		} else {
			gameState.player.setVelocityX(0);
		}
		if (gameState.cursors.up.isDown) {
			gameState.player.setVelocityY(-160)
			console.log('Set player velocityY to -160')
		}
	}
}
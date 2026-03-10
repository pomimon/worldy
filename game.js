"use-strict"

var config = {
  type: Phaser.AUTO,
  width: 360,
  height: 360,
  pixelArt: true,
    scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine"
      }
    ]
  },
}

var game = new Phaser.Game(config);

function preload() {
  console.log("preload", this)

  this.load.image('Grass', 'assets/Grass.png');
  this.load.tilemapTiledJSON('main-map', 'assets/land.tmj');

  this.load.spritesheet("fluffy", "assets/fluffy.png", {
    frameWidth: 16,
    frameHeight: 20,
  });
}

function create() {
  console.log("create", this)

  this.cameras.main.setZoom(1.45);

  const tilemap = this.make.tilemap({ key: 'main-map' });
  const tileset = tilemap.addTilesetImage('Grass');

  tilemap.layers.forEach((layer, index) => {
    tilemap.createLayer(index, tileset, 0, 0);
  });



  const playerSprite = this.add.sprite(0, 0, "fluffy");
  this.cameras.main.startFollow(playerSprite, true);
  this.cameras.main.setFollowOffset(
    -playerSprite.width / 2,
    -playerSprite.height / 2
  );

  const gridEngineConfig = {
    characters: [
      {
        id: "fluffy",
        sprite: playerSprite,
        walkingAnimationMapping: 0,
        startPosition: { x: 15, y: 14 },
        offsetY: -4,
      },
    ],
  };
  this.gridEngine.create(tilemap, gridEngineConfig);
}

function update() {
  const cursors = this.input.keyboard?.createCursorKeys();
  if (cursors.left.isDown) {
    this.gridEngine.move("fluffy", "left");
  } else if (cursors.right.isDown) {
    this.gridEngine.move("fluffy", "right");
  } else if (cursors.up.isDown) {
    this.gridEngine.move("fluffy", "up");
  } else if (cursors.down.isDown) {
    this.gridEngine.move("fluffy", "down");
  }
}

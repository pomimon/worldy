"use-strict"

var config = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
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

  this.load.image('Grass', 'assets/grass.png');
  this.load.image('Items', 'assets/objects.png');
  this.load.image('Water', 'assets/water.png');
  this.load.image('Furniture', 'assets/furniture.png');
  this.load.image('TilledDirt', 'assets/dirt.png');
  this.load.image('Wooden_House_Walls_Tilset', 'assets/house.png');

  this.load.tilemapTiledJSON('main-map', 'assets/land.tmj');

  this.load.spritesheet("fluffy", "assets/fluffy.png", {
    frameWidth: 16,
    frameHeight: 20,
  });
}

function create() {
  console.log("create", this)

  this.cameras.main.setZoom(4.0);
  console.log("setbounds", this.cameras.main.setBounds)
  this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);

  const tilemap = this.make.tilemap({ key: 'main-map' });

  const tilesets = {
    Grass: tilemap.addTilesetImage('Grass'),
    Items: tilemap.addTilesetImage('Items'),
    Furniture: tilemap.addTilesetImage('Furniture'),
    Wooden_House_Walls_Tilset: tilemap.addTilesetImage('Wooden_House_Walls_Tilset'),
    Water: tilemap.addTilesetImage('Water'),
    TilledDirt: tilemap.addTilesetImage('TilledDirt'),
  }

  tilemap.createLayer("water", tilesets.Water, 0, 0);
  tilemap.createLayer("ground", tilesets.Grass, 0, 0);
  tilemap.createLayer("hedges", tilesets.Grass, 0, 0);
  tilemap.createLayer("dirt", tilesets.TilledDirt, 0, 0);
  tilemap.createLayer("furniture", tilesets.Furniture, 0, 0);
  tilemap.createLayer("ground objects", tilesets.Items, 0, 0);
  tilemap.createLayer("house", tilesets.Wooden_House_Walls_Tilset, 0, 0);
  tilemap.createLayer("tree tops", tilesets.Items, 0, 0);
  tilemap.createLayer("objects 1", tilesets.Items, 0, 0);
  // tilemap.createLayer("objects 2", tilesets.Items, 0, 0);

  tilemap.createLayer("collision", null, 0, 0);

  const playerSprite = this.add.sprite(0, 0, "fluffy");
  this.cameras.main.startFollow(playerSprite, true);
  this.cameras.main.setFollowOffset(
    -playerSprite.width ,
    -playerSprite.height
  );

  const gridEngineConfig = {
    characters: [
      {
        id: "fluffy",
        sprite: playerSprite,
        walkingAnimationMapping: 0,
        startPosition: { x: 15, y: 4 },
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

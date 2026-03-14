"use-strict"

const IMAGES = {
  Grass: 'assets/grass.png',
  Items: 'assets/objects.png',
  Water: 'assets/water.png',
  Furniture: 'assets/furniture.png',
  TilledDirt: 'assets/dirt.png',
  ChickenHouse: 'assets/chickenHouse.png',
  Wooden_House_Walls_Tilset: 'assets/house.png',
}

const COW_WALK = {
  up: {
    leftFoot: 0,
    standing: 0,
    rightFoot: 0,
  },
  down: {
    leftFoot: 0,
    standing: 0,
    rightFoot: 0,
  },
  left: {
    leftFoot: 3,
    standing: 0,
    rightFoot: 4,
  },
  right: {
    leftFoot: 4,
    standing: 0,
    rightFoot: 3,
  },
}

const CHICK_WALK = {
  up: {
    leftFoot: 0,
    standing: 0,
    rightFoot: 0,
  },
  down: {
    leftFoot: 0,
    standing: 0,
    rightFoot: 0,
  },
  left: {
    leftFoot: 4,
    standing: 5,
    rightFoot: 6,
  },
  right: {
    leftFoot: 6,
    standing: 5,
    rightFoot: 4,
  },
}

const CHICKEN_IDS = ["chicken1", "chicken2", "chicken3"];
const COW_IDS = ["cow1", "cow2"];

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

  for (const [name, path] of Object.entries(IMAGES)) {
    this.load.image(name, path);
  }

  this.load.tilemapTiledJSON('main-map', 'assets/land.tmj');
  console.log("this.load.spritesheet", this.load.spritesheet)
  this.load.spritesheet("fluffy", "assets/fluffy.png", {
    frameWidth: 16,
    frameHeight: 20,
  });
  this.load.spritesheet("ChickenSprites", "assets/ChickenSprites.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("Cow", "assets/Cow.png", {
    frameWidth: 32,
    frameHeight: 32,
    startFrame: 0,
    endFrame: 4,
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
    ChickenHouse: tilemap.addTilesetImage('ChickenHouse'),
  }

  tilemap.createLayer("water", tilesets.Water, 0, 0);
  tilemap.createLayer("ground", tilesets.Grass, 0, 0);
  tilemap.createLayer("hedges", tilesets.Grass, 0, 0);
  tilemap.createLayer("dirt", tilesets.TilledDirt, 0, 0);
  tilemap.createLayer("furniture", tilesets.Furniture, 0, 0);
  tilemap.createLayer("ground objects", tilesets.Items, 0, 0);
  tilemap.createLayer("house", tilesets.Wooden_House_Walls_Tilset, 0, 0);
  tilemap.createLayer("tops", tilesets.Items, 0, 0);
  tilemap.createLayer("objects 1", tilesets.Items, 0, 0);
  tilemap.createLayer("chicken house", tilesets.ChickenHouse, 0, 0);

  tilemap.createLayer("collision", null, 0, 0);

  const playerSprite = this.add.sprite(0, 0, "fluffy");
  this.cameras.main.startFollow(playerSprite, true);
  this.cameras.main.setFollowOffset(
    -playerSprite.width ,
    -playerSprite.height
  );

  const chicken = CHICKEN_IDS.map((id) =>
    this.add.sprite(0, 0, "ChickenSprites").setOrigin(0.5, 1));

  const cow = COW_IDS.map((id) =>
    this.add.sprite(0, 0, "Cow").setOrigin(0.5, 1));

  const gridEngineConfig = {
    characters: [
      {
        id: "fluffy",
        sprite: playerSprite,
        walkingAnimationMapping: 0,
        startPosition: { x: 5, y: 30 },
        offsetY: -4,
      },
     ...chicken.map((sprite, i) => ({
      id: CHICKEN_IDS[i],
      sprite,
      walkingAnimationMapping: CHICK_WALK,
      startPosition: { x: 4 + i, y: 31 + i },
      offsetY: -4,
      speed: 2,
    })),
      ...cow.map((sprite, i) => ({
        id: COW_IDS[i],
        sprite,
        walkingAnimationMapping: COW_WALK,
        startPosition: { x: 25 + i, y: 25 +i },
        offsetY: -4,
        speed: 2,

      })),
    ]
  }

  this.gridEngine.create(tilemap, gridEngineConfig);

    this.cursors = this.input.keyboard.createCursorKeys();

  setupSpriteFlipping.call(this);

  setupNPCMovement.call(this);
}

function update() {
  const { left, right, up, down } = this.cursors

  if (left.isDown) this.gridEngine.move("fluffy", "left")
  else if (right.isDown) this.gridEngine.move("fluffy", "right")
  else if (up.isDown) this.gridEngine.move("fluffy", "up")
  else if (down.isDown) this.gridEngine.move("fluffy", "down")
}

function setupSpriteFlipping() {

  const NPC_IDS = [...CHICKEN_IDS, ...COW_IDS]

  this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {

    if (!NPC_IDS.includes(charId)) return

    const sprite = this.gridEngine.getSprite(charId)

    if (direction === "left") sprite.setFlipX(true)
    if (direction === "right") sprite.setFlipX(false)

  })
}

function setupNPCMovement() {

  const randomLR = () => Phaser.Math.RND.pick(["left", "right"])

  const timers = [
    ["chicken1", 3000],
    ["chicken2", 3500],
    ["chicken3", 2750],
    ["cow1", 400],
    ["cow2", 500],
  ]

  timers.forEach(([id, delay]) =>
    this.time.addEvent({
      delay,
      loop: true,
      callback: () => this.gridEngine.move(id, randomLR()),
    })
  )
}

import 'phaser';
import Sprites from "./data/Sprites";
import SlotManager from "./object/SlotManager";

export default class Game extends Phaser.Scene
{
    slotManager : SlotManager

    constructor ()
    {
        super('game');
    }

    preload ()
    {
        Sprites.list.forEach((assetName: string) => {
            this.load.image(assetName, `assets/${assetName}.png`)
        })
    }

    create ()
    {
        const bg = this.add.image(0, 0, 'Background').setOrigin(0).setDisplaySize(game.scale.width,game.scale.height);
        this.slotManager = new SlotManager(this);
        SlotManager.instance = this.slotManager
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    scene: Game
};



const game = new Phaser.Game(config);



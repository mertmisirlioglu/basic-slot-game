import Constants from "../data/Constants";

export default class Fruit extends Phaser.Physics.Arcade.Image {
    public name: string

    constructor(scene, x, y, name) {
        super(scene, x, y, name)
        this.scene = scene
        this.setDisplaySize(Constants.FRUIT_DISPLAY_WIDTH,Constants.FRUIT_DISPLAY_HEIGHT)

        this.name = name;
    }
}

import Fruit from "./Fruit";
import Constants from "../data/Constants";
import Container = Phaser.GameObjects.Container;
import SlotManager from "./SlotManager";

export default class Reel extends Container{
    scene: Phaser.Scene
    public order: number
    public fruitList : Fruit[]
    public currentFruit : string
    public stepCount = 0

    spinAnimationTimer

    constructor(scene,order) {
        super(scene)
        this.scene = scene
        this.order = order
        this.x = Constants.REEL_START_X_LIST[order];

        const r1 = scene.add.rectangle(Constants.REEL_START_X_LIST[order], 290, 148, 260, 0x6666ff);
        r1.visible = false
        this.mask = new Phaser.Display.Masks.BitmapMask(scene, r1);
        this.setScrollFactor(1.00);
        this.y = Constants.FRUIT_SPACE * 4 / 3;

        this.createFruits();
        this.scene.add.existing(this);

    }

    createFruits() : void {
        this.fruitList = new Array(Constants.REEL_FRUIT_COUNT)
        for (let i = 0; i < this.fruitList.length; i++) {
            const fruitName = Constants.FRUIT_LIST[Math.floor(Math.random() * Constants.FRUIT_LIST.length)]
            this.fruitList[i] = new Fruit(this.scene, 0 , i * Constants.FRUIT_SPACE , fruitName)
            this.add(this.fruitList[i]);
        }
    }


    spin(duration: number){
        this.scene.time.addEvent( {
            delay: duration,                // ms
            callback: this.stopReel,
            callbackScope: this,
        });

    }

    spinAnimation(){

        if(this.spinAnimationTimer) return;

        this.spinAnimationTimer = this.scene.time.addEvent({
            delay: Constants.REEL_ANIMATION_STEP,                // ms
            callback: this.nextFruit,
            callbackScope: this,
            loop: true,
        });
    }

    stopReel(){
        const step = (Math.floor(this.stepCount / 3)) % Constants.REEL_FRUIT_COUNT
        this.y = Constants.FRUIT_SPACE * 4 / 3 - (step * Constants.FRUIT_SPACE)
        this.currentFruit = this.fruitList[step % Constants.REEL_FRUIT_COUNT].name

        this.spinAnimationTimer.remove();
        this.scene.time.removeEvent(this.spinAnimationTimer)
        this.spinAnimationTimer = null

        if (this.order >= Constants.REEL_COUNT - 1) {
            SlotManager.instance.finished()
            return
        }
        SlotManager.instance.stopNextReel(this.order + 1)
    }

    public nextFruit(){
        this.y -=  Constants.FRUIT_SPACE / 3
        this.stepCount++
        if (this.y < Constants.LIMIT_Y) this.y = Constants.FRUIT_SPACE;
    }

}

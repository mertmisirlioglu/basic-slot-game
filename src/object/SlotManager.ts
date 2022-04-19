import Constants from "../data/Constants";
import Reel from "./Reel";
import Sprite = Phaser.GameObjects.Sprite;

let instance = null;
export default class SlotManager{

    static instance : SlotManager;
    scene: Phaser.Scene
    public reelList : Reel[]
    public spinTimes : number[]
    spinButton : Sprite
    winSprite : Sprite


    constructor(scene) {
        this.scene = scene
        this.createSpin()
        this.createReels()
    }

    static getInstance() {
        return instance;
    }

    createSpin(){
        this.spinButton = this.scene.add.sprite(this.scene.scale.width/2, this.scene.scale.height * 0.85, 'Spin').setOrigin(0.5);

        this.winSprite = this.scene.add.sprite(this.scene.scale.width/2, 0, 'Win').setOrigin(0.5,0.5).setDepth(2);
        this.winSprite.setVisible(false)

        this.spinButton.setInteractive()

        this.spinButton.on('pointerdown', (pointer) =>{
            this.spin()
        });

    }

    createReels() : void {
        this.reelList = new Array(Constants.REEL_COUNT)

        for (let i = 0; i < this.reelList.length; i++) {
            this.reelList[i] = new Reel(this.scene, i)
        }
    }

    spin(){

        this.spinButton.setTint(0xff0000);
        this.spinButton.disableInteractive()

        this.reelList.forEach((reel) => {
            reel.spinAnimation();
        })

        this.spinTimes = [Constants.REEL_COUNT]

        for (let i = 0; i < this.reelList.length; i++) {
            this.spinTimes[i] = Math.floor(Math.random() * Constants.MAX_SPIN_MS) + 1000
        }

        console.log("first random spin (ms) : " , this.spinTimes[0])

        this.reelList[0].spin(this.spinTimes[0]);
    }

    stopNextReel(order : number){

        console.log(order + 1 ," random spin (ms) : " , this.spinTimes[order])

        this.reelList[order].spin(this.spinTimes[order]);
    }

    finished(){
        if(this.reelList[0].currentFruit === this.reelList[1].currentFruit  && this.reelList[1].currentFruit === this.reelList[2].currentFruit) {
            console.log("wow you win")
            this.winAnimation()
        }
        else  {
            console.log("you lose")
            this.resetScene()
        }

    }

    winAnimation(){
        this.winSprite.setVisible(true)

        this.scene.tweens.add({

            targets: this.winSprite,

            props: {

                y: {
                    value: this.scene.scale.height/2,
                    duration: 1000,
                    ease: 'Power1'
                },

                x: {
                    duration: 600,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Sine.easeInOut',
                    value: this.scene.scale.width / 2
                }

            },
            onComplete: this.resetScene.bind(this)
        });
    }

    resetScene(){
        this.spinButton.setInteractive()
        this.spinButton.tint = undefined
        this.winSprite.setPosition(this.scene.scale.width/2, 0)
        this.winSprite.setVisible(false)
    }
}

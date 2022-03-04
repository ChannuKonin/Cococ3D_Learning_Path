import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AnimationEvents
 * DateTime = Sun Feb 27 2022 12:24:47 GMT+0530 (India Standard Time)
 * Author = ChannuByjus
 * FileBasename = AnimationEvents.ts
 * FileBasenameNoExtension = AnimationEvents
 * URL = db://assets/Intermediate/AnimationEvents/AnimationEvents.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('AnimationEvents')
export class AnimationEvents extends Component {

    private OnCubeMove() {
        console.log("Cube moving");
    }
}
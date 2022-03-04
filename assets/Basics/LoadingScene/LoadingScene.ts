import { _decorator, Component, CCString, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {

    @property(CCString) private sceneToLoad: string = ""; // Name of the scene to load

    start() {
        this.LoadScene();
    }

    LoadScene() {
        director.loadScene(this.sceneToLoad); // Loads scene immediately and makes it the active scene
    }

    PreloadScene() {
        // Loads scene in the background but is not activated
        // To make this scene active call director.loadScene
        director.preloadScene(this.sceneToLoad, () => {
            // Callback when the scene is loaded completely in the background
            director.loadScene(this.sceneToLoad);
        });
    }
}
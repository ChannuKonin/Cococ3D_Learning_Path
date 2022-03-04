import { _decorator, Component, Color, renderer, MeshRenderer, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MaterialProperties')
export class MaterialProperties extends Component {

    @property(Color) private color: Color = new Color(255, 255, 255, 255); // Color to assign to the material

    // Getting pass and property id is expensive, so get their references just once, usually onLoad/start
    private pass: renderer.Pass = null; // Holds the pass of the material
    private colorId: number = -1; // Holds the id of the color in the above pass

    onLoad() {
        // Get the material attached to the mesh renderer
        // Usually we want to modify the default material which is the zeroth material
        let _material: Material = this.getComponent(MeshRenderer).material;

        // Determine from the material which pass is to be modified
        // Usually it zeroth pass
        this.pass = _material.passes[0];

        // Determine the property name from the material's shader and get it's id
        this.colorId = this.pass.getHandle("albedo");

        this.pass.setUniform(this.colorId, this.color); // Assign color as a uniform to the pass
    }
}
import { _decorator, Component, Node, CCInteger, Vec3, CCBoolean, Line } from 'cc';
import { CatmullRomSpline } from './CatmullRomSpline';
const { ccclass, property } = _decorator;

@ccclass('CatmullRomSplineDemo')
export class CatmullRomSplineDemo extends Component {

    @property(Node) private nodes: Node[] = []; // Points to feed the catmull rom spline algorithm
    @property(CCInteger) private resolution: number = 2; // Number of points to generate in between two points. Higher the number smoother is the curve but at a performance cost 
    @property(CCBoolean) private closeLoop: boolean = false; // Should the curve close 

    private catmullRom: CatmullRomSpline = null; // Catmull rom object

    onLoad() {
        // Create a catmull rom spline object
        let _controlPoints: Vec3[] = []; // Base positions of the curve using which a curve is generated
        this.nodes.forEach(element => {
            _controlPoints.push(element.getWorldPosition());
        });
        this.catmullRom = new CatmullRomSpline(_controlPoints, this.resolution, this.closeLoop);

        // Get the points of the curve
        // You can use these points to draw a line or move an object along the curve, etc.
        let _points: Vec3[] = this.catmullRom.GetPoints();
    }
}
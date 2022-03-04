import { _decorator, Component, Node, Line, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineDemo')
export class LineDemo extends Component {

    @property(Node) private points: Node[] = []; // Nodes whose positions will be set to the line's positions

    private line: Line = null;

    onLoad() {
        this.line = this.getComponent(Line); // Get the line component attached to this node
    }

    update(dt: number) { // dt holds the delta time
        // Get world positions of the nodes
        let _positions: Vec3[] = [];
        this.points.forEach(element => {
            _positions.push(element.getWorldPosition());
        });
        this.line.positions = _positions; // Assign the position array to the line's positions
    }
}
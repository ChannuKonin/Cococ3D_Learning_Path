import { _decorator, Component, Node, EventTouch, Vec2, Camera, geometry, PhysicsSystem, physics, input, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Raycast')
export class Raycast extends Component {
    @property(Camera) private camera: Camera = null;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this); // Listen to touch start/mouse down event
    }

    private OnTouchStart(_event: EventTouch) {
        let _hitResult: physics.PhysicsRayResult = this.IsHittingSomething(_event.getLocation());
        if (_hitResult)
            console.log("Hit: " + _hitResult.collider.node.name);
    }

    private IsHittingSomething(_position: Vec2): physics.PhysicsRayResult {
        // Project a ray from the camera from the touch location
        let _ray: geometry.Ray = this.camera.screenPointToRay(_position.x, _position.y);
        if (PhysicsSystem.instance.raycastClosest(_ray)) { // Raycast to get the closet object from the camera
            return PhysicsSystem.instance.raycastClosestResult; // Return the result of the raycast (can be null)
        }
        return null;
    }

    onDestroy() {
        // It is important to unregister from the events especially when working with multiple scenes
        this.node.off(Node.EventType.TOUCH_START, this.OnTouchStart, this);
    }
}
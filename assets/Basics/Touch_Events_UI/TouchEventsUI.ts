import { _decorator, Component, Node, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchEventsIU')
export class TouchEventsUI extends Component {

    onLoad() {
        // node.on works only on UI nodes
        this.node.on(Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.OnTouchEnd, this);
    }

    private OnTouchStart(_event: EventTouch) {
        console.log(_event.getLocation());
    }

    private OnTouchMove(_event: EventTouch) {
        console.log(_event.getLocation());
    }

    private OnTouchEnd(_event: EventTouch) {
        console.log(_event.getLocation());
    }

    onDestroy() {
        // It is important to unregister from the events especially when working with multiple scenes
        this.node.off(Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.OnTouchEnd, this);
    }
}
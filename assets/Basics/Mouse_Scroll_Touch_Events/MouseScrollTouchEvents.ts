import { _decorator, Component, EventTouch, EventMouse, input, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MouseScrollTouchEvents')
export class MouseScrollTouchEvents extends Component {

    onLoad() {
        // input DO NOT work when interacted with UI
        input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.OnTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.OnTouchEnd, this);
        input.on(Input.EventType.MOUSE_WHEEL, this.OnScroll, this);
        input.on(Input.EventType.MOUSE_DOWN, this.OnMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.OnMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.OnMouseMove, this);
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

    private OnScroll(_event: EventMouse) {
        console.log(_event.getScrollY());
    }

    private OnMouseDown(_event: EventMouse) {
        console.log(_event.getLocation());
    }

    private OnMouseUp(_event: EventMouse) {
        console.log(_event.getLocation());
    }

    private OnMouseMove(_event: EventMouse) {
        console.log(_event.getLocation());
    }

    onDestroy() {
        // It is important to unregister from the events especially when working with multiple scenes
        input.off(Input.EventType.TOUCH_START, this.OnTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.OnTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.OnTouchEnd, this);
        input.off(Input.EventType.MOUSE_WHEEL, this.OnScroll, this);
        input.off(Input.EventType.MOUSE_DOWN, this.OnMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.OnMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.OnMouseMove, this);
    }
}
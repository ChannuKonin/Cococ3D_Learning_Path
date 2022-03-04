import { _decorator, Node, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

export class CatmullRomPoint {
    position: Vec3 = v3(0, 0, 0);
    tangent: Vec3 = v3(0, 0, 0);
    normal: Vec3 = v3(0, 0, 0);

    constructor(_position: Vec3, _tangent: Vec3, _normal: Vec3) {
        this.position = _position;
        this.tangent = _tangent;
        this.normal = _normal;
    }
}

@ccclass('CatmullRomSpline')
export class CatmullRomSpline {

    private resolution: number = 0; // Amount of points between control points. [Tesselation factor]
    private closedLoop: boolean; // Should the curve be closed
    private splinePoints: CatmullRomPoint[] = []; // Generated spline points
    private controlPoints: Vec3[] = []; // Control points to control the curve (base points)

    constructor(_controlPoints: Vec3[], _resolution: number, _closedLoop: boolean) {
        if (_controlPoints == null || _controlPoints.length <= 2 || _resolution < 2)
            return;

        this.controlPoints = [];
        for (let i: number = 0; i < _controlPoints.length; i++)
            this.controlPoints.push(_controlPoints[i]);

        this.resolution = _resolution;
        this.closedLoop = _closedLoop;

        this.GenerateSplinePoints();
    }

    // Math stuff to generate the spline points
    private GenerateSplinePoints() {
        this.InitializeProperties();

        let p0: Vec3; // Start point
        let p1: Vec3; // End point
        let m0: Vec3; // Tangent
        let m1: Vec3; // Tangent

        // First for loop goes through each individual control point and connects it to the next, so 0-1, 1-2, 2-3 and so on
        let closedAdjustment: number = this.closedLoop ? 0 : 1;
        for (let _currentPoint: number = 0; _currentPoint < this.controlPoints.length - closedAdjustment; _currentPoint++) {
            let _closedLoopFinalPoint: boolean = (this.closedLoop && _currentPoint == this.controlPoints.length - 1);

            p0 = this.controlPoints[_currentPoint];

            if (_closedLoopFinalPoint)
                p1 = this.controlPoints[0];
            else
                p1 = this.controlPoints[_currentPoint + 1];

            // m0
            if (_currentPoint == 0) // Tangent M[k] = (P[k+1] - P[k-1]) / 2
            {
                if (this.closedLoop)
                    m0 = this.Subtract(p1, this.controlPoints[this.controlPoints.length - 1]);
                else
                    m0 = this.Subtract(p1, p0);
            }
            else
                m0 = this.Subtract(p1, this.controlPoints[_currentPoint - 1]);

            // m1
            if (this.closedLoop) {
                if (_currentPoint == this.controlPoints.length - 1) // Last point case
                    m1 = this.Subtract(this.controlPoints[(_currentPoint + 2) % this.controlPoints.length], p0);
                else if (_currentPoint == 0) // First point case
                    m1 = this.Subtract(this.controlPoints[_currentPoint + 2], p0);
                else
                    m1 = this.Subtract(this.controlPoints[(_currentPoint + 2) % this.controlPoints.length], p0);
            }
            else {
                if (_currentPoint < this.controlPoints.length - 2)
                    m1 = this.Subtract(this.controlPoints[(_currentPoint + 2) % this.controlPoints.length], p0);
                else
                    m1 = this.Subtract(p1, p0);
            }

            m0 = this.Multiply(m0, 0.5); // Doing this here instead of  in every single above statement
            m1 = this.Multiply(m1, 0.5);

            let pointStep: number = 1.0 / this.resolution;

            if ((_currentPoint == this.controlPoints.length - 2 && !this.closedLoop) || _closedLoopFinalPoint) // Final point
                pointStep = 1.0 / (this.resolution - 1);  // Last point of last segment should reach p1

            // Creates [resolution] points between this control point and the next
            for (let _tesselatedPoint: number = 0; _tesselatedPoint < this.resolution; _tesselatedPoint++) {
                let t: number = _tesselatedPoint * pointStep;
                let point: CatmullRomPoint = this.Evaluate(p0, p1, m0, m1, t);
                this.splinePoints[_currentPoint * this.resolution + _tesselatedPoint] = point;
            }
        }
    }

    // Sets the length of the point array based on resolution/closed loop.
    private InitializeProperties() {
        let _pointsToCreate: number = 0;
        if (this.closedLoop)
            _pointsToCreate = this.resolution * this.controlPoints.length; // Loops back to the beginning, so no need to adjust for arrays starting at 0
        else
            _pointsToCreate = this.resolution * (this.controlPoints.length - 1);

        this.splinePoints = [];
        for (let i: number = 0; i < _pointsToCreate; i++)
            this.splinePoints.push(new CatmullRomPoint(v3(0, 0, 0), v3(0, 0, 0), v3(0, 0, 0)));
    }

    // Evaluates curve at t[0, 1]. Returns point/normal/tan struct. [0, 1] means clamped between 0 and 1.
    private Evaluate(_start: Vec3, _end: Vec3, _tanPoint1: Vec3, _tanPoint2: Vec3, _t: number): CatmullRomPoint {
        let position: Vec3 = this.CalculatePosition(_start, _end, _tanPoint1, _tanPoint2, _t);
        let tangent: Vec3 = this.CalculateTangent(_start, _end, _tanPoint1, _tanPoint2, _t);
        let normal: Vec3 = this.NormalFromTangent(tangent);

        return new CatmullRomPoint(position, tangent, normal);
    }

    // Calculates curve position at t[0, 1]
    private CalculatePosition(_start: Vec3, _end: Vec3, _tanPoint1: Vec3, _tanPoint2: Vec3, _t: number): Vec3 {
        // Hermite curve formula:
        // (2t^3 - 3t^2 + 1) * p0 + (t^3 - 2t^2 + t) * m0 + (-2t^3 + 3t^2) * p1 + (t^3 - t^2) * m1
        let _a: Vec3 = this.Multiply(_start, (2.0 * _t * _t * _t - 3.0 * _t * _t + 1.0));
        let _b: Vec3 = this.Multiply(_tanPoint1, (_t * _t * _t - 2.0 * _t * _t + _t));
        let _c: Vec3 = this.Multiply(_end, (-2.0 * _t * _t * _t + 3.0 * _t * _t));
        let _d: Vec3 = this.Multiply(_tanPoint2, (_t * _t * _t - _t * _t));

        let _position: Vec3 = this.Add(_a, _b);
        _position = this.Add(_position, _c);
        _position = this.Add(_position, _d);

        return _position;
    }

    // Calculates tangent at t[0, 1]
    private CalculateTangent(_start: Vec3, _end: Vec3, _tanPoint1: Vec3, _tanPoint2: Vec3, _t: number): Vec3 {
        // Calculate tangents
        // p'(t) = (6t² - 6t)p0 + (3t² - 4t + 1)m0 + (-6t² + 6t)p1 + (3t² - 2t)m1
        let _a: Vec3 = this.Multiply(_start, (6 * _t * _t - 6 * _t));
        let _b: Vec3 = this.Multiply(_tanPoint1, (3 * _t * _t - 4 * _t + 1));
        let _c: Vec3 = this.Multiply(_end, (-6 * _t * _t + 6 * _t));
        let _d: Vec3 = this.Multiply(_tanPoint2, (3 * _t * _t - 2 * _t));

        let _tangent: Vec3 = this.Add(_a, _b);;
        _tangent = this.Add(_tangent, _c);;
        _tangent = this.Add(_tangent, _d);;

        return _tangent.normalize();
    }

    // Calculates normal vector from tangent
    private NormalFromTangent(_tangent: Vec3): Vec3 {
        return this.Multiply(this.Cross(_tangent, Vec3.UP).normalize(), 0.5);
    }

    // Updates control points
    UpdateControlPoints(_controlPoints: Vec3[]) {
        if (_controlPoints == null || _controlPoints.length <= 0)
            return;

        this.controlPoints = [];
        for (let i: number = 0; i < _controlPoints.length; i++)
            this.controlPoints.push(_controlPoints[i]);

        this.GenerateSplinePoints();
    }

    // Updates resolution and closed loop values
    UpdateResolution(_resolution: number, _closedLoop: boolean) {
        if (_resolution < 2)
            return;

        this.resolution = _resolution;
        this.closedLoop = _closedLoop;

        this.GenerateSplinePoints();
    }

    // Returns spline points. Count is controlPoints * resolution + [resolution] points if closed loop.
    GetCatmullRomPoints(): CatmullRomPoint[] {
        if (this.splinePoints == null)
            return [];
        return this.splinePoints;
    }

    // Returns spline points. Count is controlPoints * resolution + [resolution] points if closed loop.
    GetPoints(): Vec3[] {
        if (this.splinePoints == null)
            return [];
        let _points: Vec3[] = [];
        this.splinePoints.forEach(element => {
            _points.push(element.position);
        });
        return _points;
    }

    //#region  Vector

    private Add(_a: Vec3, _b: Vec3): Vec3 {
        let _result: Vec3 = v3(0, 0, 0);
        _result.x = _a.x + _b.x;
        _result.y = _a.y + _b.y;
        _result.z = _a.z + _b.z;
        return _result;
    }

    private Subtract(_a: Vec3, _b: Vec3): Vec3 {
        let _result: Vec3 = v3(0, 0, 0);
        _result.x = _a.x - _b.x;
        _result.y = _a.y - _b.y;
        _result.z = _a.z - _b.z;
        return _result;
    }

    private Multiply(_vector: Vec3, _scalar: number): Vec3 {
        let _result: Vec3 = v3(0, 0, 0);
        _result.x = _vector.x * _scalar;
        _result.y = _vector.y * _scalar;
        _result.z = _vector.z * _scalar;
        return _result;
    }

    private Cross(_a: Vec3, _b: Vec3): Vec3 {
        return v3(
            _a.y * _b.z - _a.z * _b.y,
            _a.z * _b.x - _a.x * _b.z,
            _a.x * _b.y - _a.y * _b.x);
    }

    //#endregion 
}
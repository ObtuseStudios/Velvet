//Holds a point in 2D space
//Temporary - vectors .x or .y cannot be set see: https://github.com/VelvetOrg/velvet.js/issues/5
class Vector2
{
    private _x : number;
    private _y : number;

    public get x() : number { return this._x; }
    public get y() : number { return this._y; }

    public set x(n : number) { this._x = n; } // { Debug.Warning("Do not set x directly as it causes problems with the scenegraph! Change has been ignored"); }
    public set y(n : number) { this._y = n; } // { Debug.Warning("Do not set y directly as it causes problems with the scenegraph! Change has been ignored"); }

    constructor(x : number, y : number) { this._x = x; this._y = y; }

    public ToString() : string              { return Vector2.ToString(this); } //For debugging purposes
    public ArrayRef(index : number) : number{ return (index == 0)? this.x : this.y; } //Will take an index and return either the x or y component
    public SqrMagnitude() : number          { return (this.x * this.x) + (this.y * this.y); } //Will find the square length of a vector from the origin
    public Magnitude() : number             { return Mathf.Sqrt(this.SqrMagnitude()); } //Will find the lenght of a vector from the origin
    public Clone() : Vector2                { return new Vector2(this.x, this.y); } //Make sure no to use a pointer to the current object
    public Normalize() : Vector2 //Will find the direction from the origin of the current vector
    {
        var result = new Vector2(0, 0);
        var mag = this.Magnitude();

        //Apply
        result._x = this.x / mag;
        result._y = this.y / mag;

        //Done
        return result;
    }

    //Non static maths
    private Set(x : number, y : number) : void { this._x = x; this._y = y; }
    public Add(...args : any[]) : void { args.unshift(this); let res = Vector2._Operation(args, Vector2._AddOperator); this.Set(res.x, res.y); }
    public Sub(...args : any[]) : void { args.unshift(this); let res = Vector2._Operation(args, Vector2._SubOperator); this.Set(res.x, res.y); }
    public Mul(...args : any[]) : void { args.unshift(this); let res = Vector2._Operation(args, Vector2._MulOperator); this.Set(res.x, res.y); }
    public Div(...args : any[]) : void { args.unshift(this); let res = Vector2._Operation(args, Vector2._DivOperator); this.Set(res.x, res.y); }

    //Static built in specific vectors
    public static zero : Vector2    = new Vector2(0, 0);
    public static one : Vector2     = new Vector2(1, 1);
    public static minus : Vector2   = new Vector2(-1, -1);
    public static left : Vector2    = new Vector2(-1, 0);
    public static right : Vector2   = new Vector2(1, 0);
    public static up : Vector2      = new Vector2(0, 1);
    public static down : Vector2    = new Vector2(0, -1);

    //Static vector math functions:
    public static Dot(lhs : Vector2, rhs : Vector2)                        : number { return (lhs.x * rhs.x) + (lhs.y * rhs.y); }
    public static Det(lhs : Vector2, rhs : Vector2)                        : number { return (lhs.x * rhs.y) - (lhs.y * rhs.x);}
    public static Angle(from : Vector2, to : Vector2)                      : number { return Mathf.Atan2(Vector2.Dot(from, to), Vector2.Det(from, to)); }
    public static SqrDistance(a : Vector2, b : Vector2)                    : number { return Mathf.Pow(b.x - a.x, 2) + Mathf.Pow(b.y - a.y, 2); }
    public static Distance(a : Vector2, b : Vector2)                       : number { return Mathf.Sqrt(Vector2.SqrDistance(a, b)); }
    public static SetMagnitude(vec : Vector2, mag : number)                :Vector2 { return Vector2.Mul(vec.Normalize(), mag); }
    public static ClampMagnitude(vec : Vector2, min : number, max : number):Vector2 { return Vector2.SetMagnitude(vec, Mathf.Clamp(vec.Magnitude(), min, max)); }
    public static Lerp(a : Vector2, b : Vector2, t : number)              : Vector2 { return new Vector2(Mathf.Lerp(a.x, b.x, t), Mathf.Lerp(a.y, b.y, t)); }
    public static LerpUnclamped(a : Vector2, b : Vector2, t : number)     : Vector2 { return new Vector2(Mathf.LerpUnclamped(a.x, b.x, t), Mathf.LerpUnclamped(a.y, b.y, t)); }
    public static Max(l : Vector2, r : Vector2)                           : Vector2 { return new Vector2((l.x > r.x) ? l.x : r.x, (l.y > r.y) ? l.y : r.y); }
    public static Min(l : Vector2, r : Vector2)                           : Vector2 { return new Vector2((l.x < r.x) ? l.x : r.x, (l.y < r.y) ? l.y : r.y); }
    public static MoveTowards(c : Vector2, t : Vector2, d : number)       : Vector2 { return new Vector2(Mathf.MoveTowards(c.x, t.x, d), Mathf.MoveTowards(c.y, t.y, d)); }

    //Helpful static functions
    public static RoundInt(vec : Vector2) : Vector2 { return new Vector2(vec.x, vec.y); }
    public static Random() : Vector2 { return new Vector2(Rand.Value(), Rand.Value()); }

    //This will find the reflection of a vector based on a normal provided
    public static Reflect(velocity : Vector2, normal : Vector2) : Vector2
    {
        //R = -2*(V dot N)*N + V
        return Vector2.Add(Vector2.Mul(-2 * Vector2.Dot(velocity, normal), normal), velocity);
    }

    //Operator overloading, kinda
    private static _AddOperator(result : number, val : number) : number { return result += val; }
    private static _SubOperator(result : number, val : number) : number { return result -= val; }
    private static _MulOperator(result : number, val : number) : number { return result *= val; }
    private static _DivOperator(result : number, val : number) : number { return result /= val; }

    private static _Operation(li : any, operator : any) //'operator' should be from one of the above functions
    {
        var result = (li[0] instanceof Vector2) ? li[0].Clone() : new Vector2(li[0], li[0]);

        //Allows for infinte arguments to be parsed
        for(var i = 1; i < li.length; i++) {
            if(li[i] instanceof Vector2) { result._x = operator(result._x, li[i]._x); result._y = operator(result._y, li[i]._y); }
            else                         { result._x = operator(result._x, li[i]);   result._y = operator(result._y, li[i]); } }

        return result;
    }
    
    //Actual overloading
    public static Add(...args : any[]) : Vector2 { return this._Operation(args, Vector2._AddOperator); }
    public static Sub(...args : any[]) : Vector2 { return this._Operation(args, Vector2._SubOperator); }
    public static Mul(...args : any[]) : Vector2 { return this._Operation(args, Vector2._MulOperator); }
    public static Div(...args : any[]) : Vector2 { return this._Operation(args, Vector2._DivOperator); }

    public static ToString(val : Vector2)                : string { return val.x + " " + val.y; }
    public static Equal(a : Vector2, b : Vector2)       : boolean { return (Mathf.Approximatly(a.x, b.x) && Mathf.Approximatly(a.y, b.y)); }
    public static NotEqual(a : Vector2, b : Vector2)    : boolean { return (!Mathf.Approximatly(a.x, b.x) || !Mathf.Approximatly(a.y, b.y)); }
}

//Just a temporary solution
Debug.Warning("For transform setters do not modify .x or .y directly instead always instanciate a new Vector2()");
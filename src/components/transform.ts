//A transform reprents to positioning of a gameobject
class Transform extends SceneNode
{
    //Currently all properties are public
    private _position : Vector2 = new Vector2(0, 0);//Global position
    private _scale : Vector2 = new Vector2(1, 1);   //Global scale
    private _rotation : number = 0.0;               //Global rotation

    private _localPosition : Vector2 = new Vector2(0, 0);
    private _localScale : Vector2 = new Vector2(0, 0);
    private _localRotation : number = 0.0;

    //Setters are where the magic happens
    public get position() : Vector2 { return this._position; }
    public get rotation() : number { return this._rotation; }
    public get scale() : Vector2 { return this._scale; }

    public get localPosition() : Vector2 { return this._localPosition; }
    public get localRotation() : number { return this._localRotation; }
    public get localScale() : Vector2 { return this._localScale; }

    constructor(name:string="Transform") 
    {
        super(name);

        this._position = new Vector2(0, 0);
        this._scale = new Vector2(1, 1);
        this._rotation = 0.0;

        this._localPosition = new Vector2(0, 0);
        this._localScale = new Vector2(1, 1);
        this._localRotation = 0.0;
    }

    //Will find the closes transform parent
    private GetClosestTransformParent() : Transform
    {
        //Keep looping up one parent until root is reached
        function CheckParent(currentLayer : SceneNode) : Transform
        {
            if(currentLayer.parent.instanceID == SceneNode.root.instanceID) { return null; }

            //Is another iteration needed?
            return (currentLayer.parent instanceof Transform) ? currentLayer.parent : CheckParent(currentLayer.parent);
        } return CheckParent(this);
    }

    //Setters are not very neat, but unfortunatly this is requred
    public set position(p : Vector2) 
    { 
        //Recalculate the local position relative to the current position
        this._position = p;

        let ancestor = this.GetClosestTransformParent()

        if(ancestor == null) { this._localPosition = this._position.Clone(); }
        else { this._localPosition = Vector2.Sub(this._position, ancestor._position); }

        super.Update(); 
    }

    public set rotation(r : number) 
    { 
        this._rotation = r;
        
        let ancestor = this.GetClosestTransformParent();

        if(ancestor == null) { this._localRotation = this._rotation * 1.0; } //Making sure a pointer is not parsed
        else { this._localRotation = this._rotation - ancestor._rotation; }

        super.Update(); 
    }
    
    public set scale(s : Vector2) 
    { 
        this._scale = s;

        let ancestor = this.GetClosestTransformParent();

        if(ancestor == null) { this._localScale = this._scale.Clone(); }
        else { this._localScale = Vector2.Div(this._scale, ancestor._scale); } // May cause a division by zero error
        super.Update(); 
    }

    public set localPosition(lp : Vector2)
    {
        //Recalculate the local position relative to the current position
        this._localPosition = lp;

        let ancestor = this.GetClosestTransformParent()

        if(ancestor == null) { this._position = this._localPosition.Clone(); }
        else { this._position = Vector2.Add(this._localPosition, ancestor._position); }

        super.Update(); 
    }

    public set localRotation(lr : number)
    {
        //Recalculate the local position relative to the current position
        this._localRotation = lr;

        let ancestor = this.GetClosestTransformParent()

        if(ancestor == null) { this._rotation = this._localRotation * 1.0; }
        else { this._rotation = this._localRotation + ancestor._rotation; }

        super.Update(); 
    }

    public set localScale(ls : Vector2)
    {
        //Recalculate the local position relative to the current position
        this._localScale = ls;

        let ancestor = this.GetClosestTransformParent()

        if(ancestor == null) { this._scale = this._localScale.Clone(); }
        else { this._scale = Vector2.Add(this._localScale, ancestor._scale); }

        super.Update(); 
    }

    //This will move the position of all children based on any transformations made to this
    public Update() : void
    {
        //We can assume if this part of the code has been reached then a transformation has been made to the parent
        let parentTransform = this.GetClosestTransformParent();
        
        //Modify the position by the nearest parents change in value
        //Note this will call the setters
        this.position = Vector2.Add(this.localPosition, parentTransform.position);
        this.scale = Vector2.Mul(this.localScale, parentTransform.scale);
        this.rotation = this.localRotation + parentTransform.rotation;

        //this.localPosition = Vector2.Sub(this._position, parentTransform._position);
        //this.localScale = Vector2.Sub(this._scale, parentTransform._scale);
        //this.localRotation = this._rotation - parentTransform._rotation;

        //This will call update on all children
        super.Update();
    }

    //For debugging
    protected GetExtraInformation() : string { return `${this.position.ToString()}, ${this.rotation}, ${this.scale.ToString()} <-> ${this._localPosition.ToString()}, ${this.localRotation}, ${this.localScale.ToString()}`; }

};
//This contains a renderer class - the renderer is responsible for:
// - Controlling all canvas operations
// - Asset loading
// - More..
class Renderer
{    
    //Privates

    //Size of canvas
    private _width : number  = 100;
    private _height : number = 100;
    
    //Actual low level canvas
    private _canvas : HTMLCanvasElement = null; //The canvas elemnt
    private _context : any = null; //The canvas 2D context
    
    //Stores a stack of all gameobjects that are yet to be rendererd
    private _drawStack : Array<GameObject> = new Array() as Array<GameObject>;
    
    //Drawing properties
    private _backgroundColour : Colour = new Colour(255, 255, 255);

    //Setup everything
    public Create(w : number = 100, h : number = 100) : void
    {
        //If there is already a canvas, delete it
        if(this._canvas != null) { this._canvas.remove(); }

        //Create canvas
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        
        this.width = w;
        this.height = h;
        
        //Add to the page
        document.body.appendChild(this._canvas);
        
        //Set the current display object
        Display = this;

        //Add timer
        this._drawStack = new Array() as Array<GameObject>;
    }
    
    //Drawing wrapper functions
    public SetFillColour(colour : Colour)   : void { this._context.fillStyle = colour.GetStyle(); }
    public SetStrokeColour(colour : Colour) : void { this._context.strokeStyle = colour.GetStyle(); }
    
    public Clear() : void { this._context.clearRect(0, 0, this.width, this.height); }
    
    //Shape drawing functions
    public SimpleDrawRect(position : Vector2, scale : Vector2, col : Colour = Colour.black, rot : number = 0) : void
    { 
        //Save canvas context state
        this._context.save();
        this._context.translate(position.x, position.y);
        this._context.rotate(rot * Mathf.degToRad);
        //this._context.scale(scale..x, scale.y);
    
        //Draw
        this.SetFillColour(col);
        this._context.fillRect(-(scale.x / 2), -(scale.y / 2), scale.x, scale.y);
        
        //Done
        this._context.restore();
    }
    
    public SimpleStrokeRect(position : Vector2, scale : Vector2, col : Colour = Colour.black, rot : number = 0) : void
    { 
        //Save canvas context state
        this._context.save();
        this._context.translate(position.x, position.y);
        this._context.rotate(rot * Mathf.degToRad);
        //this._context.scale(scale..x, scale.y);
    
        //Draw
        this.SetStrokeColour(col);
        this._context.strokeRect(-(scale.x / 2), -(scale.y / 2), scale.x, scale.y);
        
        //Done
        this._context.restore();
    }
    
    private DrawRect(rect : Rectangle, trans : Transform = new Transform()) : void
    {
                           this.SimpleDrawRect  (trans.position, Vector2.Mul(trans.scale, rect.size), rect.fillColour, trans.rotation);
        if (rect.stroke) { this.SimpleStrokeRect(trans.position, Vector2.Mul(trans.scale, rect.size), rect.strokeColour); }
    }
    
    //Actual main drawing routine
    //Will account for the shape later
    protected Draw(obj : GameObject) : void { this.DrawRect(obj.renderer, obj.transform); }

    //Handles interaction with the draw stack
    public AddGameObject(g: GameObject): void { this._drawStack.unshift(g); }
    public AddGameObjects(gos: Array<GameObject>): void { for(let g of gos) { this.AddGameObject(g); } }

    //This function will be called every frame by the time class
    //Handles poping of the draw stack
    public Update(): void
    {
        //Loop though the stack
        let stackLength: number = this._drawStack.length;

        while (stackLength > 0)
        {
            //Pop from the back of the stack
            let current: GameObject = this._drawStack.pop();

            //Drawing routine is temporary
            this.Draw(current);
            
            //Increment
            stackLength -= 1;
        }
    }
    
    //Getters and setters
    public get width()  : number { return this._width; }
    public get height() : number { return this._height;}
    public get canvas() : HTMLCanvasElement { return this._canvas; }
    public get backgroundColour() : Colour { return this._backgroundColour;}
    
    public set width(w : number) { this._width = w; this._canvas.width = this._width; }
    public set height(h : number) { this._height = h; this._canvas.height = this._height; }
    public set backgroundColour(col : Colour) { this._backgroundColour = col; this._canvas.style.background = this._backgroundColour.GetStyle(); }
     
    //Public func.
    public SetSize(w : number, h : number) { this.width = w; this.height = h; }
}

//Create a default one for static use, this allows for multiple renderers
let Display: Renderer = new Renderer();
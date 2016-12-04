class Player extends GameObject
{
    constructor() { super(); }
    
    //Add a velocity property
    public velocity = new Vector2(0, 0);
}

var Const = 
{
    FRICTION : 0.75,
    MOVE_SPEED : 1.0
}

let player : Player;
let cursor : GameObject;
let gun : GameObject;

function Awake() 
{ 
    //Webpage features
    document.body.requestPointerLock();

    //Rendering
    Display.Create(800, 400); 
    Display.backgroundColour = Colour.magenta;

    player = new Player();
    cursor = new GameObject();
    gun = new GameObject();
    
    //Set properties (will later be handled by json)
    player.transform.position = new Vector2(400, 200);
    player.renderer.size = new Vector2(20, 20);
    player.renderer.fillColour = Colour.white;
    
    cursor.renderer.size = new Vector2(5, 5);
    cursor.renderer.fillColour = Colour.red;
    
    //Later uses a scene graph
    gun.renderer.size = new Vector2(5, 20);
    gun.renderer.fillColour = Colour.white;
}

function Update() 
{
    Display.Clear();

    let direction : Vector2 = new Vector2(0, 0);

    //Input    
    if(Input.GetKey(Input.KeyCode.a)) { direction.x -= 1; }
    if(Input.GetKey(Input.KeyCode.d)) { direction.x += 1; }
    if(Input.GetKey(Input.KeyCode.w)) { direction.y -= 1; }
    if(Input.GetKey(Input.KeyCode.s)) { direction.y += 1; }
    
    if(Mathf.Abs(direction.x) + Mathf.Abs(direction.y) > 1) { direction = Vector2.Mul(direction, 0.7); }
    
    //Move
    player.velocity = Vector2.Mul(direction, Const.MOVE_SPEED);
    
    //Apply friction
    player.velocity.x *= Const.FRICTION;
    player.velocity.y *= Const.FRICTION;

    //Apply the velocity
    player.transform.position.x += player.velocity.x;
    player.transform.position.y += player.velocity.y;
    
    //Rotate to face the cursor
    let normalizedMouse = Vector2.Sub(cursor.transform.position, player.transform.position);
    player.transform.rotation = Mathf.Atan2(normalizedMouse.y, normalizedMouse.x) * Mathf.radToDeg;
    
    //Draw the cursor at mouse position
    cursor.transform.position = Input.GetMousePosition(Display);
    
    //Later handled by the scene graph
    gun.transform.position = Vector2.Add(player.transform.position, Vector2.Mul((cursor.transform.position), 10).Normalize());
    
    //Temp
    Display.AddGameObject(player);
    Display.AddGameObject(gun);
    Display.AddGameObject(cursor);
}

//Temporary
function Late() { Display.Update(); }

//Event listeners
Time.AddAwakeCallback(Awake); 
Time.AddUpdateCallback(Update);
Time.AddLateUpdateCallback(Late);
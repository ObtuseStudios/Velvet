#velvet.js
> A js canvas wrapper

---

*Velvet.js is a typescript boilerplate that allows for the easier creation of games for the web. Being powered by Typescript 2.0 meant that velvet.js has a solid object oriented backbone.*

Currently supported features:

1. Rendering that doesn't suck
2. Colours that make sense - not more '#FFF'
3. Time management - no more worrying about different frame rates
4. Input manager - key events that make game programming simpler
5. Maths - maths functions specific to graphics
6. Debugging - Extensive debugging past the traditional console
7. Random number generation

more will be added soon..

Here is a demo of how to make a simple platformer

```typescript
//Add some properties to the gameobject class
class Player extends GameObject
{
    constructor() { super(); }

    //Public properties
    public velocity : Vector2 = Vector2.zero;
    public grounded : boolean = false;
}

//Consts
var Const = 
{
    GRAVITY : 1.0,
    FRICTION : 0.85,
    JUMP_HEIGHT : 12
}

//Player
let player : Player;

function Awake() 
{ 
    //Rendering
    Display.Create(800, 400); 
    Display.backgroundColour = Colour.magenta;

    player = new Player();
    player.transform.position = new Vector2(400, 200);
    player.renderer.size = new Vector2(20, 20);
    player.renderer.fillColour = Colour.white;
}

function Update() 
{
    Display.Clear();

    //Input
    if(Input.GetKey(Input.KeyCode.a)) { player.velocity.x -= 1; }
    if(Input.GetKey(Input.KeyCode.d)) { player.velocity.x += 1; }

    player.velocity.x *= Const.FRICTION;
    player.velocity.y += Const.GRAVITY;

    if(Input.GetKeyDown(Input.KeyCode.w) && player.grounded) { player.velocity.y -= Const.JUMP_HEIGHT; }

    //Apply the velocity
    player.transform.position.x += player.velocity.x;
    player.transform.position.y += player.velocity.y;

    //Collision detection (kinda)
    let playerSize : Vector2 = Vector2.Mul(player.transform.scale, player.renderer.size);

    if(player.transform.position.y > Display.height - (playerSize.y / 2)) 
    {
        //Resition of the Collision
        player.transform.position.y -= player.transform.position.y - (Display.height - (playerSize.y / 2)); //Delta
        player.grounded = true;
        player.velocity.y = 0;
    }
    else { player.grounded = false; }

    //Done
    Display.AddGameObject(player);
}

function LateUpdate() { Display.Update(); }

//Event listeners
Time.AddAwakeCallback(Awake); Time.AddUpdateCallback(Update); Time.AddLateUpdateCallback(LateUpdate);
```

---

> How is this possible? Typescript, just typescript!

In closing:
*Any project, big or small, will benefit from using velvet js - as it does the heavy lifting so you can focus on what really matters.*

---

The project employs the following naming convention:
- Classes and functions use camel casing starting with a capital : "ExampleClass", "ExampleFunction"
- variables and member vars use camel casing : "exampleFloat", "anotherExample"
- Private of protected properties begin with an underscore : "_privateVariable", "_PrivateMethod"
- Constants use an all uppercase separated by underscore convention  : "EXAMPLE_CONST"
- Curley brackets on the next line please
- If a statment is short do it inline (with braces) e.g. if(true) { func(); }

Practises:
- Don't over comment, most of the code will be self explanatory
- Dont use a comment header explaining the class
- Each class should get its own file
- Every class should have a constructor even if it is blank
- Each method should have one or two lines explaining its contents
- Every file and folder is all lowercase
- Namespaces are used instead of static classes
- If a callback is required, declare the function in the local scope
- Add to this list if necessary...

---

Attribution:
- Mainloop js (src/lib/mainloop.min.js) from https://github.com/IceCreamYou/MainLoop.js
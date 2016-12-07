//This is a static classe used to get input from the keyboard and mouse
namespace Input
{
    //Holds an array of key data
    let _keyHeldData : boolean[] = []; //Data will be true while a key is being held down
    let _keyDownData : boolean[] = []; //Data will be true for one frame when a key is pressed down
    let _keyReleaseData : boolean[] = []; //Data will be true for one frame when a key is released

    let _mouseHeldData : boolean[] = []; //Data will be true while a mouse button is being held down
    let _mouseDownData : boolean[] = []; //Data will be true for one frame when a mouse button is pressed down
    let _mouseReleaseData : boolean[] = []; //Data will be true for one frame when a mouse button is released
    
    //Check for keyboard events
    export function GetKey(keyCode : number) : boolean { return _keyHeldData[keyCode]; }; //Continuous input check
    export function GetKeyUp(keyCode : number) : boolean { return _keyReleaseData[keyCode]; }; //Key up input check
    export function GetKeyDown(keyCode : number) : boolean { return _keyDownData[keyCode]; }; //Key down input check

    export function GetMouse(keyCode : number) : boolean { return _mouseHeldData[keyCode]; }; //Continuous input check
    export function GetMouseUp(keyCode : number) : boolean { return _mouseReleaseData[keyCode]; }; //Key up input check
    export function GetMouseDown(keyCode : number) : boolean { return _mouseDownData[keyCode]; }; //Key down input check

    let _mousePosition : Vector2 = new Vector2(0, 0);    

    export function GetMousePosition(disp : Renderer) : Vector2 
    { 
        let rect : any = disp.canvas.getBoundingClientRect();
        return new Vector2(_mousePosition.x - rect.left, _mousePosition.y - rect.top);
    }

    //Holds the input movement axis
    let _axis : Vector2 = new Vector2(0, 0);

    export function GetAxisHorizontal() { return _axis.x; }
    export function GetAxisVertical() { return _axis.y; }

    //Called by event listeners
    function _CallbackMouseMove(event : MouseEvent) : void  { _prevent(event); _mousePosition = new Vector2(event.clientX, event.clientY); };

    function _CallbackKeyDown(event : KeyboardEvent) : void { _prevent(event); if(_keyHeldData[event.keyCode] != true) { _keyDownData[event.keyCode] = true; } _keyHeldData[event.keyCode] = true; };
    function _CallbackKeyUp(event : KeyboardEvent) : void   { _prevent(event); delete _keyHeldData[event.keyCode]; delete _keyDownData[event.keyCode]; _keyReleaseData[event.keyCode] = true; };

    function _CallbackMouseDown(event : MouseEvent) : void { _prevent(event); if(_mouseHeldData[event.button] != true) { _mouseDownData[event.button] = true; } _mouseHeldData[event.button] = true; };
    function _CallbackMouseUp(event : MouseEvent) : void   { _prevent(event); delete _mouseHeldData[event.button]; delete _mouseDownData[event.button]; _mouseReleaseData[event.button] = true; };

    function _CallbackUpdate() : void 
    {
        _keyDownData = [ ]; _keyReleaseData = [ ]; _mouseDownData = [ ]; _mouseReleaseData = [ ]; 

        //Needs to calculate the movement axis
        let right : boolean = (Input.GetKey(Input.KeyCode.right) || Input.GetKey(Input.KeyCode.d));
        let left : boolean = (Input.GetKey(Input.KeyCode.left) || Input.GetKey(Input.KeyCode.a));
        let down : boolean = (Input.GetKey(Input.KeyCode.down) || Input.GetKey(Input.KeyCode.s));
        let up : boolean = (Input.GetKey(Input.KeyCode.up) || Input.GetKey(Input.KeyCode.w));

        _axis = new Vector2(0, 0);

        //_axis.x += (right == true)? 1 : 0;
        //_axis.x -= (left == true)? 1 : 0;
        _axis = Vector2.Add(new Vector2(_axis.x, 0), new Vector2((right == true)? 1 : 0, 0));
        _axis = Vector2.Sub(new Vector2(_axis.x, 0), new Vector2((left == true)? 1 : 0, 0));

        //_axis.y += (up == true)? 1 : 0;
        //_axis.y -= (down == true)? 1 : 0;
        _axis = Vector2.Add(_axis, new Vector2(0, (up == true)? 1 : 0));
        _axis = Vector2.Sub(_axis, new Vector2(0, (down == true)? 1 : 0));

    }

    //Will prevent default browser behaviour
    function _prevent(event : Event) : void { event.preventDefault(); }

    //Event listeners for input events
    window.addEventListener("mousemove", _CallbackMouseMove);
    window.addEventListener("mousedown", _CallbackMouseDown);
    window.addEventListener("mouseup", _CallbackMouseUp);
    window.addEventListener("keydown", _CallbackKeyDown);
    window.addEventListener("keyup", _CallbackKeyUp);

    Time.AddLateUpdate(_CallbackUpdate); //Needs to subscribe to late update

    //Defines all javascript key codes
    export let KeyCode = 
    {
        mousemiddle : 1,
        mouseright : 2,
        mouseleft : 0,

        right:  39,
        down:   40,
        left:   37,
        up:     38,
        
        backspace: 8,
        pagedown:  34,
        escape:    27,
        pageup:    33,
        insert:    45,
        space:     32,
        tilda:     192,
        enter:     13,
        tab:       9,
        end:       35,
        home:      36,
        del:       46,

        zero:  48, 
        one:   49,
        two:   50, 
        three: 51, 
        four:  52, 
        five:  53, 
        six:   54, 
        seven: 55, 
        eight: 56, 
        nine:  57,

        a: 65, 
        b: 66, 
        c: 67, 
        d: 68, 
        e: 69, 
        f: 70, 
        g: 71, 
        h: 72, 
        i: 73, 
        j: 74, 
        k: 75, 
        l: 76, 
        m: 77, 
        n: 78, 
        o: 79, 
        p: 80, 
        q: 81, 
        r: 82, 
        s: 83, 
        t: 84, 
        u: 85, 
        v: 86, 
        w: 87, 
        x: 88, 
        y: 89, 
        z: 90
    };
};
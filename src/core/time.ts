declare var MainLoop : any;

//This assumes that ("../lib/mainloop.min.js") is imported from html
//This class handles all of the timing related operations
namespace Time
{
    //export let timescale : number = 1.0; //Move by this much percent every frame
    export let delta : number = 0; //Difference in time between subsequent function calls
    export let time : number = 0; //Counter since game began
    export let fps : number = 0; //Frames per second
    export let maxfps : number = 60; //Target
    
    //Holds an array of call backs
    let _awakeCallbacks : Array<() => void> = [ ];
    let _startCallbacks : Array<() => void> = [ ];

    let _earlyCallbacks : Array<() => void>  = [ ];
    let _updateCallbacks : Array<() => void> = [ ];
    let _drawCallbacks : Array<() => void>   = [ ];
    let _lateCallbacks : Array<() => void>   = [ ];
    
    export function SetFps(f : number) { Time.maxfps = f; MainLoop.setMaxAllowedFPS(Time.maxfps); }
    
    //Functions call backs 
    export function AddAwake(call : any) : void { _awakeCallbacks.push(call); };
    export function AddStart(call : any) : void { _startCallbacks.push(call); };
    
    export function AddEarlyUpdate(call : () => void) : void   { _earlyCallbacks.push(call); };
    export function AddUpdate(call : () => void) : void        { _updateCallbacks.push(call); };
    export function AddDrawUpdate(call : () => void) : void    { _earlyCallbacks.push(call); };
    export function AddLateUpdate(call : () => void) : void    { _lateCallbacks.push(call); };
    
    //Actual functions
    function _Awake() : void { for(let c of _awakeCallbacks) { c(); } _Start(); };
    function _Start() : void { for(let c of _startCallbacks) { c(); } MainLoop.start() };
    
    function _EarlyUpdate(timestamp : number, delta : number) : void  { Time.delta = delta; for(let c of _earlyCallbacks) { c(); } }
    function _Update() : void { for(let c of _updateCallbacks) { c(); } };
    function _DrawUpdate(interpolationPercentage : number) : void  { for(let c of _drawCallbacks) { c(); } }
    
    function _LateUpdate(fps : number, panic : boolean) : void 
    { 
        for(let c of _lateCallbacks) { c(); } 
        
        //Set the frames per second
        Time.fps = fps * 1.0;
        Time.time += Time.delta;

        if (panic) 
        {
            let discardedTime = Mathf.Round(MainLoop.resetFrameDelta());
            Debug.Warning('Main loop stopped - discarding ' + discardedTime + 'ms');
        }
    };

    window.addEventListener("load", _Awake);
    MainLoop.setBegin(_EarlyUpdate);
    MainLoop.setUpdate(_Update);
    MainLoop.setDraw(_DrawUpdate)
    MainLoop.setEnd(_LateUpdate);
}
//Everything in the engine must inherit from this
//Will allow for generatic functions to take in any type
class Base
{
    constructor(name : string = "new") { this.name = name; }

    public name : string = ""; //Pointless, just allows for clean organisation
    protected _instanceID : number = Base.GetNextInstanceID(); //Like a GUID, but counts up
    public get instanceID() : number { return this._instanceID; }

    //Counts up everytime an instance of this class is created
    //Later update the allocation system to account for destroyed entitys
    private static _instanceCounter : number = 0;
    public static GetNextInstanceID() { Base._instanceCounter += 1; return Base._instanceCounter; }
    public ToString() : string { return this.name + " : " + (<any>this).constructor.name + " - InstanceID : " + this.instanceID; }

    //Removes every known property
    public Destroy() : void 
    { 
        for(let prop in this)
        {
            if(this.hasOwnProperty(prop)) { delete this[prop]; }
        }

        delete this;
    }

    public static Destroy(object : Base) : void { object.Destroy(); }

    // -- NOT WORKING --
    
    /*Will create an exact copy of this
    public Clone<T extends Base>(): T
    {
        let result = <T>(new (<any>this.constructor));

        for (var attrib in this) 
        {
            if (this.hasOwnProperty(attrib)) 
            {
                //Instance ID must be unique for every object
                if(this[attrib] === this.instanceID) { continue; }
     
                result[attrib] = this[attrib];
            }
        }

        result.name = this.name + " clone";
        return result;
    }

    public static Instantiate(original : Base) : Base { return original.Clone(); }
    */
}
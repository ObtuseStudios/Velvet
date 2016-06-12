//Console and debugging function wrappers
const debug =
{
    //Contains debugger functions (wrapper functions for now)
    log: function(string) { console.log(string); },
    error: function(string) { console.error("Error: " + string); },
    warning: function(string) { console.warn("Warning: " + string); },
    clear: function() { console.clear(); }
}

//Useful math functions
const mathematics =
{
    //Converts from radians to degrees
    radToDeg: function(num)
    {
        //Make sure paramter is a number
        if(typeof num != 'number') debug.error("Radian conversion failed, not a valid number");

        //Apply formula
        return num * (180 / Math.PI);
    },

    //Converts degrees back to radians
    degToRad: function(num)
    {
        //Make sure paramter is a number
        if(typeof num != 'number') debug.error("Radian conversion failed, not a valid number");

        //Apply formula
        return num * (Math.PI / 180);
    },

    //Makes value between min and max
    clamp: function(value, min, max)
    {
        //All values must be numbers
        if(typeof value != 'number') debug.error("Clamp failed, not a valid number");
        if(typeof min != 'number') debug.error("Clamp failed, not a valid number");
        if(typeof max != 'number') debug.error("Clamp failed, not a valid number");

        //Modify the value of 'value'
        var result = value;

        if(result > max) result = max;
        if(result < min) result = min;

        //Return
        return result;
    },

    randomRange: function(min, max, round = false)
    {
        //Check types
        if(typeof min != 'number') debug.error("RandomRange has invalid parameter type, expected number");
        if(typeof max != 'number') debug.error("RandomRange has invalid parameter type, expected number");
        if(typeof round != 'boolean') debug.error("RandomRange has invalid parameter type, expected boolean");

        //Return value
        var answer = Math.random() * (max + 1) + (min);

        if(round) answer = mathematics.toInt(answer);

        return answer;
    },

    //Round but very efficient.
    //source: http://www.html5rocks.com/en/tutorials/canvas/performance/
    toInt: function(somenum)
    {
        // With a bitwise or.
        rounded = (0.5 + somenum) | 0;

        // A double bitwise not.
        rounded = ~~ (0.5 + somenum);

        // Finally, a left bitwise shift.
        rounded = (0.5 + somenum) << 0;

        return rounded;
    },

    //Linearly interpolates between to values by 't'
    //Source Nvidea: http://http.developer.nvidia.com/Cg/lerp.html
    lerp: function(a, b, t)
    {
        //Formula
        return a + t * (b - a);
    }
}

//Contains to integers to use for position, scale ect...
var vector = function(x = 0, y = 0)
{
    //Private variables
    var componentX = 0;
    var componentY = 0;

    //Getter function
    this.getX = function() { return componentX; }
    this.getY = function() { return componentY; }

    //Private function for setting one part of vector
    var setSingle = function(channel, value)
    {
        //Make sure that new x is a number
        if(typeof value != 'number') debug.error("value is not a number");

        //Round to int
        //No longer used
        //value = mathematics.toInt(value);

        //Set
        if(channel == "x") componentX = value;
        else if(channel == "y") componentY = value;

        //Error
        else debug.error("Channel of vector does not exist");
    }

    //A function to set the preperies after constructor
    this.set = function(x, y)
    {
        //Use set x and y function combined
        setSingle('x', x);
        setSingle('y', y);
    }

    //Get by integer value
    this.getByNumber = function(index)
    {
        //Parameter must be an integer number
        if(typeof index != 'number') debug.error("Not valid index");
        if(index != parseInt(index)) debug.error("Not an integer");
        if(index > 1 || index < 0) debug.error("Index out of range");

        //Actually return
        if(index == 0) return this.getX();
        else if(index == 1) return this.getY();
    }

    //Converts vector to a string for useful printing
    this.toString = function()
    {
        //Format as string
        var result = "x: " + componentX + " y: " + componentY;

        return result;
    }

    //Set object variables based on constructor
    this.set(x, y);
}

//Static vector functions
const vecMath =
{
    //For convenience
    checkType: function(other)
    {
        //Is not an instance of a vector
        if(!(other instanceof vector))
        {
            debug.error("Parameter is not a vector instance");
            return true;
        }

        //Okay
        return false;
    },

    //Generates random vector with paraamters in mind
    random: function(min, max)
    {
        //Check type of the parameters.
        if(typeof min != 'number') debug.log("not a valid parameter type");
        if(typeof max != 'number') debug.log("not a valid parameter type");

        //Stores the result
        var result = new vector();
        var answerX = (Math.random() * max) + min;
        var answerY = (Math.random() * max) + min;

        //Set
        result.set(answerX, answerY);
        return result;
    },

    //Checks if two vector are equal
    isEqual: function(a, b)
    {
        //Make sure other is a vector
        this.checkType(a);
        this.checkType(b);

        //Return based on x and y
        if(a.getX() == b.getX() && a.getY() == b.getY()) return true;
        else return false;
    },

    //Returns distance between two vectors
    distance: function(a, b)
    {
        //Check type of parameter
        this.checkType(a);
        this.checkType(b);

        //Difference between componenets:
        var xDif = a.getX() - b.getX();
        var yDif = a.getX() - b.getY();

        //find sqrt of result
        return Math.sqrt(Math.pow(xDif, 2) + Math.pow(yDif, 2));
    },

    //Returns the length of the vector
    length: function(vec)
    {
        //Check
        this.checkType(vec);

        //Apply formula
        return Math.sqrt(Math.pow(vec.getX(), 2) + Math.pow(vec.getY(),2));
    },

    //Returnsthe normalized form of a vector
    normalize: function(vec)
    {
        //Make sure is vector
        this.checkType(vec);

        //Apply formula
        var resultX = vec.getX() / (this.length(vec))
        var resultY = vec.getY() / (this.length(vec))

        //Resturn vector of this form
        return new vector(resultX, resultY);
    },

    //Finds angle between from and to vectors
    angle: function(from, to)
    {
        //Check paramter
        this.checkType(from);
        this.checkType(to);

        //Apply formula and convert to degrees
        return mathematics.radToDeg(Math.atan2(to.getY() - from.getY(),to.getX() - from.getX()));
    },

    //Find the dot product of the vector
    //I dont know if this is correct
    dot: function(a, b)
    {
        //Check type is a vector
        this.checkType(a);
        this.checkType(b);

        //Stores the resuting number
        var result = 0;

        //Add by formula
        result += a.getX() * b.getX();
        result += a.getY() * b.getY();

        //Done
        return result;
    },

    //Rounds this vector to an integer
    round: function(vec)
    {
        //Check type of vector
        this.checkType(vec);

        //Round each component of vector
        return new vector(mathematics.toInt(vec.getX()), mathematics.toInt(vec.getY()));
    },

    //Interpolates vector but is clamped between: (0, 1)
    lerp: function(origin, target, time, shouldClamp = true)
    {
        //All paramters must have correct type
        if(typeof time != 'number') debug.error("lerp time is not a number");
        this.checkType(target);
        this.checkType(origin);

        //Clamp amount
        var t = time;
        if(shouldClamp) t = mathematics.clamp(time, 0, 1);

        //Apply lerp function to each component
        var targetX = mathematics.lerp(origin.getX(), target.getX(), t);
        var targetY = mathematics.lerp(origin.getY(), target.getY(), t);

        return new vector(targetX, targetY);
    },

    //A function for apply math to components of a vector
    math: function(operation, a, b)
    {
        //Make sure other is of type vector
        this.checkType(a);
        this.checkType(b);

        //Decide which operation
        if(operation == "*") return new vector(a.getX() * b.getX(), a.getY() * b.getY());
        else if(operation == "+") return new vector(a.getX() + b.getX(), a.getY() + b.getY());
        else if(operation == "-") return new vector(a.getX() - b.getX(), a.getY() - b.getY());
        else if(operation == "/") return new vector(a.getX() / b.getX(), a.getY() / b.getY());
        else debug.error("Not valid operation in vector maths function");
    },

    //Make a function to 'move towards'!   <----

    //Wrappers of math functions
    multiply: function(a, b) { return this.math('*', a, b); },
    divide: function(a, b) { return this.math('/', a, b); },
    add: function(a, b) { return this.math('+', a, b); },
    subtract: function(a, b) { return this.math('-', a, b); },

    //Single math wrappe
    multiplyNum: function(vec, num)
    {
        if(typeof num != 'number') debug.error("Only apply math to number");

        return this.math('*', vec, new vector(num, num));
    }
}

//And RGBA colour for renderering ect...
var colour = function(red = 0, green = 0, blue = 0, alpha = 255)
{
    //Private memebers
    var r, g, b, a;

    //Gets single values
    this.getRed = function() { return r }
    this.getGreen = function() { return g }
    this.getBlue = function() { return b }
    this.getAlpha = function() { return a }

    //Sets channel of colour
    this.setChannel = function(channel, newValue)
    {
        //Check that inputs are numbers
        if(typeof newValue != 'number') debug.error("new channel of colour is not a number");

        //Round to integer
        newValue = mathematics.toInt(newValue);

        //Clamp at 255 and 0
        if(newValue > 255) newValue = 255;
        if(newValue < 0) newValue = 0;

        //Set
        if(channel == "r") r = newValue;
        else if(channel == "g") g = newValue;
        else if(channel == "b") b = newValue;
        else if(channel == "a") a = newValue;

        //Error occured
        else debug.error("No valid channel was passed, use a string e.g: 'r'.");
    }

    //A function to set the properties after constructor
    this.set = function(red, green, blue, alpha = 'undefined')
    {
        //Fix alpha channel
        if(alpha = 'undefined') alpha = 255;

        this.setChannel('r', red);
        this.setChannel('g', green);
        this.setChannel('b', blue);
        this.setChannel('a', alpha);
    }

    //Constructor set value
    this.set(red, green, blue, alpha);

    //Convert colour to string
    this.toString = function()
    {
        //Format as string
        return r + ", " + g + ", " + b + ", " + a;
    }
}

//Colour mathematics
const colourMath =
{
    //Colour lerp
    colourLerp: function(col, target, time)
    {
        //Make sure parameters are correct type
        if(!(col instanceof colour)) debug.error("Not a colour");
        if(!(target instanceof colour)) debug.error("Not a colour");
        if(typeof time != 'number') debug.error("Time is not a valid number");

        //Resulting colour
        var result = new colour();

        result.setChannel('r', mathematics.lerp(col.getRed(), target.getRed(), time));
        result.setChannel('g', mathematics.lerp(col.getGreen(), target.getGreen(), time));
        result.setChannel('b', mathematics.lerp(col.getBlue(), target.getBlue(), time));
        result.setChannel('a', mathematics.lerp(col.getAlpha(), target.getAlpha(), time));

        //Return
        return result;
    },

    //Source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    componentToHex: function(c)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    toHex: function(col)
    {
        //Check type of paramter
        if(!(col instanceof colour)) debug.console.error("Not a valid colour");

        //Use function I found on stack :)
        return '#' + this.componentToHex(col.getRed())
                    + this.componentToHex(col.getGreen())
                    + this.componentToHex(col.getBlue());
    },

    random: function(useAlpha = false)
    {
        //Make sure variable is correct type
        if(typeof useAlpha != 'boolean') debug.error("Not a boolean type in random colour funct");

        //Create colour and set each channel
        var result = new colour();

        result.setChannel('r', mathematics.toInt(Math.random() * 255));
        result.setChannel('g', mathematics.toInt(Math.random() * 255));
        result.setChannel('b', mathematics.toInt(Math.random() * 255));
        if(useAlpha) result.setChannel('a', mathematics.toInt(Math.random() * 255));

        //Return the calculation
        return result;
    }
}

//Default vectors with no magnitude
const presets =
{
    //Manually define vector directions
    one: new vector(1, 1),
    minus: new vector(-1, -1),
    zero: new vector(0, 0),
    left: new vector(-1, 0),
    right: new vector(1, 0),
    up: new vector(0, 1),
    down: new vector(0, -1),

    //Colour presets
    black: new colour(0, 0, 0),
    grey: new colour(128, 128, 128),
    white: new colour(255, 255, 255),
    red: new colour(255, 0, 0),
    orange: new colour(255, 128, 0),
    yellow: new colour(255, 255, 0),
    lime: new colour(128, 255, 0),
    green: new colour(255, 0, 0),
    turquiose: new colour(0, 255, 128),
    cyan: new colour(0, 255, 255),
    lightBlue: new colour(0, 128, 255),
    blue: new colour(255, 0, 0),
    purple: new colour(255, 0, 255),
    pink: new colour(255, 0, 128)

}

var transform = function(position = new vector(), rotation = 0, scale = new vector(1, 1))
{
    //This function sets properties of transform and corrects their type
    this.set = function(position, rotation, scale)
    {
        //Make sure paramters are the right data type (Why javascript?)
        if(typeof rotation != 'number') debug.error("Rotation is a number, parameter is not.");

        //Convert rotation to integer
        else rotation = mathematics.toInt(rotation);

        if(!(position instanceof vector)) debug.error("Position is a vector, parameter is not.");
        if(!(scale instanceof vector)) debug.error("Scale is a vector, parameter is not.");

        //Set class variables
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    //Constructor sets the properties
    this.set(position, rotation, scale);

    //Returns string formatted properties
    this.toString = function()
    {
        var resultString = '';

        resultString += "Transform stats" + "\n";
        resultString += "Position " + this.position.toString() + "\n";
        resultString += "Scale " + this.scale.toString() + "\n";
        resultString += "Rotation " + this.rotation + "\n";

        return resultString;
    }
}

const primitives =
{
    SQUARE: 'SQUARE',
    ELIPSE: 'ELIPSE',
    TRIANGLE: 'TRIANGLE',
    POLYGON: 'POLYGON',
    PATH: 'PATH',
    LINE: 'LINE',
    CURVE: 'CURVE'
}

var renderer = function(renderShape = primitives.SQUARE)
{
    this.colour = new colour(0, 0, 0);
    this.renderDepth = 0;
}

var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var killMe = new renderer(primitives.ELIPSE);
var timer = 0;
var bounce = false;

function update(delta)
{
    killMe.colour = colourMath.colourLerp(new colour(100, 255, 255), new colour(70, 255, 200), timer);

    var coeffecient = bounce !== true ? 1 : -1;
    timer += (delta / 1000) * coeffecient;

    if(timer > 1) bounce = true;
    if (timer < 0) bounce = false;
}

function draw(interpolation)
{
    context.clearRect(0, 0, 640, 480);
    context.fillStyle = colourMath.toHex(killMe.colour);
    context.fillRect(50, 50, 100, 100);
}

function end(fps, panic) { }

MainLoop.setMaxAllowedFPS(60);
MainLoop.setUpdate(update);
MainLoop.setDraw(draw);
MainLoop.setEnd(end);
MainLoop.start();

/*Update crap:
var lastFrame = 0; //Last Ms time frame was run
var maxFPS = 60; //Maximum frames every second
var deltaTime = 0; //The difference in frame time

var milliFPS = 1000 / maxFPS; //Avoid repeat calculation

function mainLoop(timeStamp)
{
    //Limit the frame rate
    if(timeStamp < lastFrame + milliFPS)
    {
        //DO not udate or draw on this frame
        requestAnimationFrame(mainLoop);
        return;
    }

    //Increase last frame time
    delta = timeStamp - lastFrame;
    lastFrame = timeStamp;

    //Change object properties, using delta time
    update(delta);

    //Draw all renderers
    draw();

    //Go to next frame
    requestAnimationFrame(mainLoop);
}
*/

/* This is the goal
function update()
{
    if(input.buttonDown(keys.left)) { playerVelocty = presets.left; }
    if(input.buttonDown(keys.right)) { playerVelocty = presets.right; }
    if(input.buttonDown(keys.up)) { playerVelocty = presets.up; }
    if(input.buttonDown(keys.down)) { playerVelocty = presets.down; }

    player.position.addWith(playerVelocity);
    console.log(player.position.toString());
}
*/

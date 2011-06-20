//this function will create a MyClass object
//javascript object constructors are just normal functions
function MyClass()
{
}

//Here I define a method belonging to the MyClass object.
//It just returns the square root of 2
MyClass.prototype.DoSomething = function()
{
	return Math.sqrt(2);
}

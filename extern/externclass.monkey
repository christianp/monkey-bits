'How to declare and use an external class written in native code
'by Christian Perfect

'import the native code
Import "externclass.js"

Extern

'declare the external class and its method
Class MyClass="MyClass"
	Method DoSomething()
End

Public

'The external class needs to be extended by a monkey class before it can be used. The monkey class provides a constructor function.
Class MyMyClass Extends MyClass
End


Function Main()
	'create an instance of the extended class.
	'Note that because MyMyClass extends the original MyClass, the variable a can have type MyClass
	Local a:MyClass = New MyMyClass
	
	'Call the method. This should print the square root of 2 to the console.
	Print a.DoSomething()
End

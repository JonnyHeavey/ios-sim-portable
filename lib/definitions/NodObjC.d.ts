declare module "nodobjc" {
	export function importFramework(frameworkName: string): void;
	export var classDefinition: IClass;

	export var NSObject: INSObject;
	export var NSString: INSString;
	export var NSNumber: INSNumber;
	export var NSBundle: INSBundle;
	export var NSAutoreleasePool: INSAutoreleasePool;
	export var kCFRunLoopDefaultMode: INSString;
	export function CFRunLoopRunInMode(mode: INSString, seconds: number, returnAfterSourceHandled: boolean): number;

	interface IClass {
		getClassByName(className: string): any;
	}

	interface INSObjectBase {
		(functionName: string, ...args: any[]): any;
	}

	interface INSObject extends INSObjectBase {
		extend(className: string): any;
	}

	interface INSString extends INSObjectBase { }

	interface INSNumber extends INSObjectBase { }

	interface INSBundle extends INSObjectBase { }

	interface INSAutoreleasePool extends INSObjectBase { }

	interface INSRunLoop extends INSObjectBase { }
}

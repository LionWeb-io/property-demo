// Generated by the Freon Language Generator.
import { IMainInterpreter } from "@freon4dsl/core";
import { PropertiesInterpreter } from "../PropertiesInterpreter";

/**
 * The class that registers all interpreter function with the main interpreter.
 */
export function PropertiesInterpreterInit(main: IMainInterpreter) {
    const interpreter = new PropertiesInterpreter(main);

    main.registerFunction("Property", interpreter.evalProperty);
    main.registerFunction("Value", interpreter.evalValue);
    main.registerFunction("BooleanValue", interpreter.evalBooleanValue);
    main.registerFunction("DecValue", interpreter.evalDecValue);
    main.registerFunction("IntValue", interpreter.evalIntValue);
    main.registerFunction("StringValue", interpreter.evalStringValue);
    main.registerFunction("PropertiesFile", interpreter.evalPropertiesFile); // DONE
}

// Generated by the Freon Language Generator.
import { FreCompositeTyper } from "@freon4dsl/core";

import { SimpleformsTyperPart } from "./SimpleformsTyperPart";
import { freonConfiguration } from "../../config/FreonConfiguration";

/**
 * Adds all known type- providers the root typer.
 * @param rootTyper
 */
export function initializeTypers(rootTyper: FreCompositeTyper) {
    for (const p of freonConfiguration.customTypers) {
        rootTyper.appendTyper(p);
    }
    rootTyper.appendTyper(new SimpleformsTyperPart());
}
// Generated by the Freon Language Generator.
import { FreNamedNode, FreNodeReference, FreWriter } from "@freon4dsl/core";
import { SimpleformsEveryConcept, INamedConcept, Form, ItemGroup, SimpleItem, Type, StringType, IntType } from "../../language/gen";

/**
 * SeparatorType is used to unparse lists.
 * NONE means only space(s) between the elements.
 * Terminator means that every element is terminated with a certain string.
 * Separator means that in between elements a certain string is placed.
 */
enum SeparatorType {
    NONE = "NONE",
    Terminator = "Terminator",
    Separator = "Separator",
    Initiator = "Initiator"
}

/**
 * Class SimpleformsModelUnitWriter provides methods to return a string representation of an instance of
 * elements of language simpleforms.
 * It is, amongst others, used to create error messages in the validator.
 */
export class SimpleformsModelUnitWriter implements FreWriter {
    output: string[] = []; // stores the result, one line per array element
    currentLine: number = 0; // keeps track of the element in 'output' that we are working on

    /**
     * Returns a string representation of 'modelelement'.
     * If 'short' is present and true, then a single-line result will be given.
     * Otherwise, the result is always a multi-line string.
     * Note that the single-line-string cannot be parsed into a correct model.
     *
     * @param modelelement
     * @param startIndent
     * @param short
     */
    public writeToString(modelelement: SimpleformsEveryConcept, startIndent?: number, short?: boolean): string {
        this.writeToLines(modelelement, startIndent, short);
        return `${this.output
            .map(line => `${line.trimEnd()}`)
            .join("\n")
            .trimEnd()}`;
    }

    /**
     * Returns a string representation of 'modelelement', divided into an array of strings,
     * each of which contain a single line (without newline).
     * If 'short' is present and true, then a single-line result will be given.
     * Otherwise, the result is always a multi-line string.
     *
     * @param modelelement
     * @param startIndent
     * @param short
     */
    public writeToLines(modelelement: SimpleformsEveryConcept, startIndent?: number, short?: boolean): string[] {
        // set default for optional parameters
        if (startIndent === undefined) {
            startIndent = 0;
        }
        if (short === undefined) {
            short = false;
        }

        // make sure the global variables are reset
        this.output = [];
        this.currentLine = 0;

        // begin the unparsing with an indent if asked for
        let indentString: string = "";
        for (let _i = 0; _i < startIndent; _i++) {
            indentString += " ";
        }
        this.output[this.currentLine] = indentString;

        // do the actual work
        this.unparse(modelelement, short);
        return this.output;
    }

    /**
     * Returns the name of 'modelelement' if it has one, else returns
     * a short unparsing of 'modelelement'.
     * Used by the validator to produce readable error messages.
     *
     * @param modelelement
     */
    public writeNameOnly(modelelement: SimpleformsEveryConcept): string {
        if (!modelelement) return "";

        if (modelelement instanceof Form) {
            return modelelement.name;
        } else if (modelelement instanceof ItemGroup) {
            return modelelement.name;
        } else if (modelelement instanceof SimpleItem) {
            return modelelement.name;
        } else {
            // make sure the global variables are reset
            this.output = [];
            this.currentLine = 0;
            // do not care about indent, we just need a single line
            this.output[this.currentLine] = "";
            // do the actual work
            this.unparse(modelelement, true);
            return this.output[0].trimEnd();
        }
    }

    private unparse(modelelement: SimpleformsEveryConcept, short: boolean) {
        if (!modelelement) return;
        switch (modelelement.freLanguageConcept()) {
            case "ItemGroup":
                this.unparseItemGroup(modelelement as ItemGroup, short);
                break;
            case "SimpleItem":
                this.unparseSimpleItem(modelelement as SimpleItem, short);
                break;
            case "Type":
                this.unparseType(modelelement as Type, short);
                break;
            case "StringType":
                this.unparseStringType(modelelement as StringType, short);
                break;
            case "IntType":
                this.unparseIntType(modelelement as IntType, short);
                break;
            case "Form":
                this.unparseForm(modelelement as Form, short);
                break;
            case "INamedConcept":
                this.unparseINamedConcept(modelelement as INamedConcept, short);
                break;
        }
    }

    /**
     * Unparsing of 'Form' according to projection 'default'.
     */
    private unparseForm(modelelement: Form, short: boolean) {
        const blockIndent = this.output[this.currentLine].length;
        // do the first line
        this.output[this.currentLine] += `Form `;
        this.output[this.currentLine] += `${modelelement.name} `;

        if (!short) {
            // do the rest of the lines as well
            this.newlineAndIndentation(blockIndent + 0);
            this.output[this.currentLine] += "";
            ("");
            this.newlineAndIndentation(blockIndent + 0);
            this.unparseList(
                modelelement.groups,
                "",
                SeparatorType.Separator,
                true,
                this.output[this.currentLine].length,
                short,
                (modelelement, short) => this.unparse(modelelement, short)
            );
        }
    }

    /**
     * Unparsing of 'ItemGroup' according to projection 'default'.
     */
    private unparseItemGroup(modelelement: ItemGroup, short: boolean) {
        const blockIndent = this.output[this.currentLine].length;
        // do the first line
        this.output[this.currentLine] += `Itemgroup `;
        this.output[this.currentLine] += `${modelelement.name} `;

        if (!short) {
            // do the rest of the lines as well
            this.newlineAndIndentation(blockIndent + 0);
            this.output[this.currentLine] += `Items: `;
            this.newlineAndIndentation(blockIndent + 4);
            this.unparseList(
                modelelement.items,
                "",
                SeparatorType.Separator,
                true,
                this.output[this.currentLine].length,
                short,
                (modelelement, short) => this.unparse(modelelement, short)
            );
            this.newlineAndIndentation(blockIndent + 0);
            this.output[this.currentLine] += "";
            ("");
        }
    }

    /**
     * Unparsing of 'SimpleItem' according to projection 'default'.
     */
    private unparseSimpleItem(modelelement: SimpleItem, short: boolean) {
        this.output[this.currentLine] += `Item `;
        this.output[this.currentLine] += `${modelelement.name} `;
        this.output[this.currentLine] += `: `;
        this.unparse(modelelement.type, short);
    }

    /**
     * Unparsing of 'StringType' according to projection 'default'.
     */
    private unparseStringType(modelelement: StringType, short: boolean) {
        this.output[this.currentLine] += `string `;
    }

    /**
     * Unparsing of 'IntType' according to projection 'default'.
     */
    private unparseIntType(modelelement: IntType, short: boolean) {
        this.output[this.currentLine] += `integer `;
    }

    /**
     * The abstract concept 'Type' is not unparsed.
     */
    private unparseType(modelelement: Type, short: boolean) {
        throw new Error("Method unparseType should be implemented by its (concrete) subclasses.");
    }
    /**
     * The interface 'INamedConcept' is not unparsed.
     */
    private unparseINamedConcept(modelelement: SimpleformsEveryConcept, short: boolean) {
        throw new Error("Method unparseINamedConcept should be implemented by the classes that implement it.");
    }

    /**
     *
     */
    private unparseReference(modelelement: FreNodeReference<FreNamedNode>, short: boolean) {
        if (!!modelelement) {
            const type: FreNamedNode = modelelement?.referred;
            if (!!type) {
                this.output[this.currentLine] += modelelement.pathnameToString(".") + " ";
            } else {
                this.output[this.currentLine] += modelelement.pathnameToString(".") + " ";
            }
        }
    }

    /**
     * Adds a string representation of 'list' to the 'output', using 'sepText' , and 'sepType' to include either a separator string
     * or a terminator string. Param 'vertical' indicates whether the list should be represented vertically or horizontally.
     * If 'short' is false, then a multi-line result will be given. Otherwise, only one single-line string is added.
     * @param list
     * @param sepText
     * @param sepType
     * @param vertical
     * @param indent
     * @param short
     */
    private unparseList(
        list: SimpleformsEveryConcept[],
        sepText: string,
        sepType: SeparatorType,
        vertical: boolean,
        indent: number,
        short: boolean,
        method: (modelelement: SimpleformsEveryConcept, short: boolean) => void
    ) {
        list.forEach((listElem, index) => {
            const isLastInList: boolean = index === list.length - 1;
            this.doInitiator(sepText, sepType);
            method(listElem, short);
            this.doSeparatorOrTerminatorAndNewline(sepType, isLastInList, sepText, vertical, short, indent);
        });
    }

    /**
     * Adds a string representation of a list of references, where every reference
     * is replaced by the name of its referred element. The use of params
     * 'sepText' and 'SepType' are equals to those in the private method unparseList.
     * @param list
     * @param sepText
     * @param sepType
     * @param vertical
     * @param indent
     * @param short
     */
    private unparseReferenceList(
        list: FreNodeReference<FreNamedNode>[],
        sepText: string,
        sepType: SeparatorType,
        vertical: boolean,
        indent: number,
        short: boolean
    ) {
        list.forEach((listElem, index) => {
            const isLastInList: boolean = index === list.length - 1;
            this.doInitiator(sepText, sepType);
            this.unparseReference(listElem, short);
            this.doSeparatorOrTerminatorAndNewline(sepType, isLastInList, sepText, vertical, short, indent);
        });
    }

    /**
     * Adds a string representation of 'list' to the 'output', using 'sepText' , and 'sepType' to include either a separator string
     * or a terminator string. Param 'vertical' indicates whether the list should be represented vertically or horizontally.
     * If 'short' is false, then a multi-line result will be given. Otherwise, only one single-line string is added.
     * @param list
     * @param isIdentifier : indicates whether or not the value should be surrounded with double quotes
     * @param sepText
     * @param sepType
     * @param vertical
     * @param indent
     * @param short
     */
    private unparseListOfPrimitiveValues(
        list: (string | number | boolean)[],
        isIdentifier: boolean,
        sepText: string,
        sepType: SeparatorType,
        vertical: boolean,
        indent: number,
        short: boolean
    ) {
        if (!!list) {
            list.forEach((listElem, index) => {
                const isLastInList: boolean = index === list.length - 1;
                if (typeof listElem === "string" && !isIdentifier) {
                    this.output[this.currentLine] += `"${listElem}"`;
                } else {
                    this.output[this.currentLine] += `${listElem}`;
                }
                this.doSeparatorOrTerminatorAndNewline(sepType, isLastInList, sepText, vertical, short, indent);
            });
        }
    }

    /**
     * Adds a separator, terminator, or initiator text (followed or preceded by a newline and the right amount of indentation)
     * to the output, depending on the parameters.
     * @param sepType
     * @param isLastInList
     * @param sepText
     * @param vertical
     * @param short
     * @param indent
     */
    // tslint:disable-next-line:max-line-length
    private doSeparatorOrTerminatorAndNewline(
        sepType: SeparatorType,
        isLastInList: boolean,
        sepText: string,
        vertical: boolean,
        short: boolean,
        indent: number
    ) {
        // first eliminate any whitespace at the end of the line
        this.output[this.currentLine] = this.output[this.currentLine].trimEnd();

        if (!vertical && (!sepText || sepText.length == 0)) {
            // at least separate the items by a space to avoid things
            // like "IntegerFunction", which should be "Integer Function"
            sepText = " ";
        }

        // then add the right separator or terminator
        switch (sepType) {
            case SeparatorType.Separator: {
                if (!isLastInList) {
                    this.output[this.currentLine] += sepText;
                }
                break;
            }
            case SeparatorType.Terminator: {
                this.output[this.currentLine] += sepText;
                break;
            }
            case SeparatorType.Initiator: {
                break;
            }
            case SeparatorType.NONE: {
                if (!vertical) {
                    // at least separate the items by a space to avoid things
                    // like "IntegerFunction", which should be "Integer Function"
                    this.output[this.currentLine] += " ";
                }
                break;
            }
        }

        // then add newline and indentation
        if (vertical && !isLastInList) {
            if (!short) {
                this.newlineAndIndentation(indent);
            } else {
                // stop after 1 line
                // note that the following cannot be parsed
                this.output[this.currentLine] += ` ...`;
            }
        } else if (isLastInList) {
            // end with a space to avoid things
            // like "666after", which should be "666 after"
            if (this.output[this.currentLine][this.output[this.currentLine].length - 1] !== " ") {
                this.output[this.currentLine] += ` `;
            }
        }
    }

    /**
     * Makes a new entry in the 'output' array
     * and adds the indentation of 'number' spaces
     * to the new entry/line.
     * @param indent
     */
    private newlineAndIndentation(indent: number) {
        this.currentLine += 1;
        let indentation: string = "";
        for (let _i = 0; _i < indent; _i++) {
            indentation += " ";
        }
        this.output[this.currentLine] = indentation;
    }

    /**
     * Adds the 'initiator' text
     * @param sepText
     * @param sepType
     * @private
     */
    private doInitiator(sepText: string, sepType: SeparatorType) {
        if (sepType === SeparatorType.Initiator) {
            this.output[this.currentLine] += sepText;
        }
    }
}
package io.lionweb.propertydemo.parser

import com.strumenta.kolasu.codegen.ASTCodeGenerator
import com.strumenta.kolasu.model.Node
import io.lionweb.PROPS.*

class PropertiesCodeGenerator : ASTCodeGenerator<Node>() {
    override fun registerRecordPrinters() {
        recordPrinter<PropertiesFile> {
            printList(it.props, "")
        }
        recordPrinter<Property> {
            print(it.name)
            print(" = ")
            print(it.value)
            println()
        }
        recordPrinter<IntValue> {
            print(it.value)
        }
        recordPrinter<DecValue> {
            print(it.value)
        }
        recordPrinter<BooleanValue> {
            print(it.value.toString())
        }
        recordPrinter<StringValue> {
            print("\"")
            print(it.value)
            print("\"")
        }
    }
}

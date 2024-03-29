package io.lionweb.propertydemo.xtendgenerators.emf.reflective;

import io.lionweb.lioncore.java.emf.EMFModelExporter
import io.lionweb.lioncore.java.model.Node
import io.lionweb.lioncore.java.serialization.JsonSerialization
import io.lionweb.propertydemo.json.PROPSLanguage
import io.lionweb.propertydemo.json.PROPSLoader
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.util.List
import java.util.stream.Collectors
import org.eclipse.emf.ecore.EAttribute
import org.eclipse.emf.ecore.EClass
import org.eclipse.emf.ecore.EObject
import org.eclipse.emf.ecore.resource.Resource

class EmfReflective {
	def static void main(String[] args) {
		new EmfReflective().generate()
	}

	def generate() {
		val jsonSerialization = JsonSerialization.getStandardSerialization();
		jsonSerialization.registerLanguage(PROPSLanguage.getInstance().PROPERTIES_MM);
		jsonSerialization.getInstantiator().enableDynamicNodes();
		val inputStream = new PROPSLoader().loadInstance()
		val List<Node> nodes = jsonSerialization.deserializeToNodes(inputStream);
		val List<Node> roots = nodes.stream().filter[it.parent === null].collect(Collectors.toList());

		val EMFModelExporter emfExporter = new EMFModelExporter();
		val Resource resource = emfExporter.exportResource(roots);
		val EObject propertiesFile = resource.contents.head

		val fileName = "emf-reflective-generator"
		val htmlFile = new File('''«fileName»-index.html''')
		val bw = new BufferedWriter(new FileWriter(htmlFile))

		val lang = new EmfPropertyLanguage(propertiesFile)

		bw.write('''
			<!DOCTYPE html>
			<head>
				<style>
					div { display: block; margin-left: auto; margin-right: auto; width: 50% }
					h1 { text-align: center; }
					label { display: block; width: 100%; text-align: center; }
					input { width: 100%; }
				</style>
			</head>
			<html>
			    <body>
			    	<div>
			    		<h1>LionWeb Sample «fileName»</h1>
			    		   <div>
			    		       <form>
			    		        «FOR prop : propertiesFile.eContents»
			    		        	«val propName = prop.eGet(lang.propertyNameAttribute)»
			    		        	<label for="«propName»">«propName»</label>
			    		        	«IF prop.eContents.head.eClass.name == "IntValue"»
			    		        		<input type="number" id="«propName»" name="«propName»" placeholder="«prop.eContents.head.eGet(lang.intValueAttribute)»"><br><br>
			    		        	«ELSEIF prop.eContents.head.eClass.name == "BooleanValue"»
			    		        		<input type="checkbox" id="«propName»" name="«propName»" checked="«prop.eContents.head.eGet(lang.booleanValueAttribute)»"><br><br>
			    		        	«ELSEIF prop.eContents.head.eClass.name == "StringValue"»
			    		        		<input type="text" id="«propName»" name="«propName»" placeholder="«prop.eContents.head.eGet(lang.stringValueAttribute)»"><br><br>
			    		        	«ELSEIF prop.eContents.head.eClass.name == "DecValue"»
			    		        		<input type="number" id="«propName»" name="«propName»" placeholder="«prop.eContents.head.eGet(lang.decValueAttribute)»"><br><br>
			    		        	«ENDIF»
			    		        «ENDFOR»
			    		       </form>
			    		   </div>
			    	</div>
			    </body>
			</html>
		''')
		bw.close()

		println('''
			Saved html file «fileName» to «htmlFile.absolutePath»
		''')
	}
}

class EmfPropertyLanguage {
	public var EClass propertyClass
	public var EAttribute propertyNameAttribute
	public var EClass intValueClass
	public var EClass booleanValueClass
	public var EClass stringValueClass
	public var EClass decValueClass
	public var EAttribute intValueAttribute
	public var EAttribute booleanValueAttribute
	public var EAttribute stringValueAttribute
	public var EAttribute decValueAttribute

	new(EObject propertiesFile) {
		propertyClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "Property"] as EClass
		propertyNameAttribute = propertyClass.EAllAttributes.findFirst[it.name == "name"]
		intValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "IntValue"] as EClass
		booleanValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "BooleanValue"] as EClass
		stringValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "StringValue"] as EClass
		decValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "DecValue"] as EClass
		intValueAttribute = intValueClass.EAllAttributes.findFirst[it.name == "value"]
		booleanValueAttribute = booleanValueClass.EAllAttributes.findFirst[it.name == "value"]
		stringValueAttribute = stringValueClass.EAllAttributes.findFirst[it.name == "value"]
		decValueAttribute = decValueClass.EAllAttributes.findFirst[it.name == "value"]
	}
}

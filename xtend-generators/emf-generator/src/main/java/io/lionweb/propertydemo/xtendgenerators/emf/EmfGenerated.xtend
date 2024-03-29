package io.lionweb.propertydemo.xtendgenerators.emf;

import io.lionweb.java.emf.builtins.BuiltinsPackage
import io.lionweb.lioncore.java.emf.EMFModelExporter
import io.lionweb.lioncore.java.emf.mapping.ConceptsToEClassesMapping
import io.lionweb.lioncore.java.model.Node
import io.lionweb.lioncore.java.serialization.JsonSerialization
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.BooleanValue
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.DecValue
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.IntValue
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.Io_lionweb_PROPSPackage
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.PropertiesFile
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.Property
import io.lionweb.propertydemo.emf.io_lionweb_PROPS.StringValue
import io.lionweb.propertydemo.json.PROPSLanguage
import io.lionweb.propertydemo.json.PROPSLoader
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.util.List
import org.eclipse.emf.ecore.resource.Resource

class EmfGenerated {
	def static void main(String[] args) {
		new EmfGenerated().generate()
	}

	def generate() {
		// Setup Ecore
		BuiltinsPackage.eINSTANCE.getNsURI();
		Io_lionweb_PROPSPackage.eINSTANCE.getNsURI();

		// Setup LionWeb serialization
		val lang = PROPSLanguage.getInstance()
		val JsonSerialization jsonSerialization = JsonSerialization.getStandardSerialization();
		jsonSerialization.registerLanguage(lang.PROPERTIES_MM);
		jsonSerialization.getInstantiator().enableDynamicNodes();

		// Load model from MPS
		val inputStream = new PROPSLoader().loadInstance()
		val nodes = jsonSerialization.deserializeToNodes(inputStream);
		val List<Node> roots = nodes.filter[it.parent === null].toList

		// Setup mapping between LionWeb and EMF
		val ConceptsToEClassesMapping conceptMapper = new ConceptsToEClassesMapping();
		conceptMapper.registerMapping(lang.PROPERTIES_MM, Io_lionweb_PROPSPackage.eINSTANCE);

		// Export instance from LionWeb to EMF
		val EMFModelExporter emfExporter = new EMFModelExporter(conceptMapper);
		val Resource resource = emfExporter.exportResource(roots);

		// Find entry point
		val PropertiesFile propsFile = resource.contents.filter(PropertiesFile).head
		val List<Property> properties = propsFile.props

		// Setup file output
		val fileName = "emf-generator"
		val htmlFile = new File('''«fileName»-index.html''')
		val bw = new BufferedWriter(new FileWriter(htmlFile))

		// Generate
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
			    		        «FOR prop : properties»
			    		        	<label for="«prop.name»">«prop.name»</label>
			    		        	«property(prop.value, prop.name)»
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

	def static dispatch property(IntValue v, String name) '''
		<input type="number" id="«name»" name="«name»" placeholder="«v.value»"><br><br>
	'''

	def static dispatch property(DecValue v, String name) '''
		<input type="number" id="«name»" name="«name»" placeholder="«v.value»"><br><br>
	'''

	def static dispatch property(StringValue v, String name) '''
		<input type="text" id="«name»" name="«name»" placeholder="«v.value»"><br><br>
	'''

	def static dispatch property(BooleanValue v, String name) '''
		<input type="checkbox" id="«name»" name="«name»" checked="«v.value»"><br><br>
	'''
}

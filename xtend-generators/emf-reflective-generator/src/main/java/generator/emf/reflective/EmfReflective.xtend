package generator.emf.reflective;

import io.lionweb.lioncore.java.emf.EMFModelExporter
import io.lionweb.lioncore.java.model.Node
import io.lionweb.lioncore.java.serialization.JsonSerialization
import io.lionweb.lioncore.java.language.LionCoreBuiltins
import io.lionweb.lioncore.java.emf.mapping.ConceptsToEClassesMapping
import java.io.File
import java.util.List
import java.util.stream.Collectors
import io.lionweb.emf.support.PropertiesLanguage
import org.eclipse.emf.ecore.EClass
import org.eclipse.emf.ecore.resource.Resource
import org.eclipse.emf.ecore.resource.ResourceSet
import org.eclipse.emf.ecore.resource.impl.ResourceSetImpl
import org.eclipse.emf.ecore.xmi.impl.XMIResourceFactoryImpl
import org.eclipse.emf.ecore.xmi.impl.XMLResourceFactoryImpl
import org.eclipse.emf.ecore.EcorePackage
import org.eclipse.emf.ecore.EcoreFactory

class EmfReflective {
	def static void main(String[] args) {
		Resource.Factory.Registry.INSTANCE.getExtensionToFactoryMap().put("library", new XMIResourceFactoryImpl());
		Resource.Factory.Registry.INSTANCE.getExtensionToFactoryMap().put("xml", new XMLResourceFactoryImpl());
		var ResourceSet rs = new ResourceSetImpl();
		rs.getResourceFactoryRegistry().getExtensionToFactoryMap().put("xml", new XMLResourceFactoryImpl());
		
		var JsonSerialization jsonSerialization = JsonSerialization.getStandardSerialization();
	    jsonSerialization.registerLanguage(PropertiesLanguage.PROPERTIES_MM);
	    jsonSerialization.getInstantiator().enableDynamicNodes();
	    val nodes = jsonSerialization.deserializeToNodes(new File(".\\..\\..\\properties-parser\\example1-exported.lm.json"));
	    var List<Node> roots = nodes.stream().filter[it.parent === null].collect(Collectors.toList());

	    var ConceptsToEClassesMapping conceptMapper = new ConceptsToEClassesMapping();
	    	
	   	conceptMapper.registerMapping(LionCoreBuiltins.getNode(), EcorePackage.eINSTANCE.getEObject())
	   	
	   	val builtinsEPackage = EcoreFactory.eINSTANCE.createEPackage()
	   	builtinsEPackage.name = "LionCore_builtins"
	   	builtinsEPackage.nsURI = "LionCore-builtins"
	   	
	   	val eCoreINamed = EcoreFactory.eINSTANCE.createEClass()
	   	eCoreINamed.name = "INamed"
	   	eCoreINamed.interface = true
	   	builtinsEPackage.EClassifiers.add(eCoreINamed)
	   	
	   	val eCoreINamedName = EcoreFactory.eINSTANCE.createEAttribute()
	   	eCoreINamedName.name = "name"
	   	eCoreINamedName.EType = EcorePackage.eINSTANCE.EString
	   	eCoreINamed.EStructuralFeatures.add(eCoreINamedName)
	   	
	   	conceptMapper.registerMapping(LionCoreBuiltins.getINamed(), eCoreINamed)
	    
	    var EMFModelExporter emfExporter = new EMFModelExporter(conceptMapper);
	    var Resource resource = emfExporter.exportResource(roots);
	       
	    val propertiesFile = resource.contents.head
	    val propertyClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "Property"] as EClass
	    val propertyValueAttribute = propertyClass.EReferences.findFirst[it.name == "value"]
	    val intValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "IntValue"] as EClass
	    val booleanValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "BooleanValue"] as EClass
	    val stringValueClass = propertiesFile.eClass.EPackage.EClassifiers.findFirst[it.name == "StringValue"] as EClass
	    val intValueAttribute = intValueClass.EAllAttributes.findFirst[it.name == "value"]
	    val booleanValueAttribute = booleanValueClass.EAllAttributes.findFirst[it.name == "value"]
	    val stringValueAttribute = stringValueClass.EAllAttributes.findFirst[it.name == "value"]
	    
	    println('''
			«FOR prop: propertiesFile.eContents»
				«IF prop.eContents.head.eClass.name == "IntValue"»
					number: «prop.eContents.head.eGet(intValueAttribute)»
				«ELSEIF prop.eContents.head.eClass.name == "BooleanValue"»
					boolean: «prop.eContents.head.eGet(booleanValueAttribute)»
				«ELSEIF prop.eContents.head.eClass.name == "StringValue"»
					string: «prop.eContents.head.eGet(stringValueAttribute)»
				«ENDIF»
			«ENDFOR»
	    ''')
	}
}
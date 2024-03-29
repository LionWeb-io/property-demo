package io.lionweb.propertydemo.parser

import com.strumenta.kolasu.language.KolasuLanguage
import com.strumenta.kolasu.lionweb.LionWebModelConverter
import com.strumenta.kolasu.lionweb.StarLasuLWLanguage
import io.lionweb.PROPS.*
import io.lionweb.lioncore.java.language.Language
import io.lionweb.lioncore.java.serialization.JsonSerialization
import io.lionweb.propertydemo.json.PROPSLoader
import java.io.File
import java.io.FileInputStream
import java.io.InputStream

class PropertiesModelLoader {
    private var language: Language
    private var jsonSer: JsonSerialization

    init {
        val languageStream = PROPSLoader().loadLanguage()
        require(languageStream != null)
        jsonSer = JsonSerialization.getStandardSerialization()
        jsonSer.instanceResolver.addTree(StarLasuLWLanguage)
        language = jsonSer.deserializeToNodes(languageStream).first() as Language
        jsonSer.classifierResolver.registerLanguage(language)
    }

    fun loadModel(file: File): PropertiesFile {
        return loadModel(FileInputStream(file))
    }

    fun loadModel(inputStream: InputStream): PropertiesFile {
        jsonSer.enableDynamicNodes()
        val model = jsonSer.deserializeToNodes(inputStream)

        val lwImpExp = LionWebModelConverter()
        val kolasuLanguage = KolasuLanguage("properties").apply {
            addClass(PropertiesFile::class)
            addClass(Property::class)
            addClass(Value::class)
            addClass(IntValue::class)
            addClass(BooleanValue::class)
            addClass(StringValue::class)
            addClass(DecValue::class)
        }

        lwImpExp.associateLanguages(language, kolasuLanguage)
        return lwImpExp.importModelFromLionWeb(model.first()) as PropertiesFile
    }
}

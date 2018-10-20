package org.webtree.mydata.api.domain.data

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.webtree.mydata.api.domain.Tag
import java.util.*

@Document
abstract class Data {
    @Id
    var id: String = UUID.randomUUID().toString()

//    val tags: List<Tag> = ArrayList()
}
package org.webtree.mydata.api.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
class Tag {
    @Id
    lateinit var id: String
    lateinit var name: String
}
package org.webtree.mydata.api.domain

import org.springframework.data.annotation.Id
import javax.validation.constraints.NotNull

class PersonalData {
    @Id
    lateinit var id: String
    @NotNull
    private var tags: Array<Tag>? = null
}
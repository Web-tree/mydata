package org.webtree.mydata.api.service

import org.webtree.mydata.api.domain.PersonalData
import org.webtree.mydata.api.domain.Tag
import org.webtree.mydata.api.domain.User
import reactor.core.publisher.Flux

class PersonalDataService {
    fun findBy(user: User, tags: Set<Tag>): Flux<PersonalData> {
        TODO()
    }
}
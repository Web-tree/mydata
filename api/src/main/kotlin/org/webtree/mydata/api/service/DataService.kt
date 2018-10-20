package org.webtree.mydata.api.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.webtree.mydata.api.domain.data.Data
import org.webtree.mydata.api.domain.Tag
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.repository.DataRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class DataService(@Autowired val dataRepository: DataRepository) {
    fun findBy(user: User, tags: Set<Tag>): Flux<Data> {
        TODO()
    }

    fun findBy(id: String): Mono<Data> {
        return dataRepository.findById(id)
    }

    fun save(data: Data): Mono<Data> {
        return dataRepository.save(data)
    }
}
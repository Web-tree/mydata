package org.webtree.mydata.api.repository

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import org.webtree.mydata.api.domain.data.Data

@Repository
interface DataRepository: ReactiveMongoRepository<Data, String>
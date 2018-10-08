package org.webtree.mydata.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.webtree.mydata.domain.PersonalData;

@Repository
public interface PersonalDataRepository extends ReactiveMongoRepository<PersonalData, String> {
}

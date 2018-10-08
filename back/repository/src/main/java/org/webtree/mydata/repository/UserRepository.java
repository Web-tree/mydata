package org.webtree.mydata.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.webtree.mydata.domain.User;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {
}

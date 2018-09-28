package org.webtree.mydata.api.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.repository.UserRepository
import reactor.core.publisher.Mono

@Service
class UserService(@Autowired val userRepository: UserRepository) {
    fun findById(id: String): Mono<User> {
        return userRepository.findById(id)
    }

    fun addUser(user: User): Mono<User> {
        return userRepository.save(user)
    }
}
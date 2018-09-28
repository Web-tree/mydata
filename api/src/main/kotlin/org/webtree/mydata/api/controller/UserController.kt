package org.webtree.mydata.api.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.service.UserService
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/users")
class UserController @Autowired constructor(val userService: UserService) {

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: String): Mono<User> {
        return userService.findById(id)
    }
}
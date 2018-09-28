package org.webtree.mydata.api.controller

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.jupiter.api.fail
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.context.annotation.ComponentScan
import org.springframework.core.ParameterizedTypeReference
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import org.webtree.mydata.api.ApiApplication
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.service.UserService
import reactor.core.publisher.toMono

@RunWith(SpringRunner::class)
@WebFluxTest(UserController::class)
@WithMockUser
@ContextConfiguration(classes = [Config::class])
internal class UserControllerTest {
    @Autowired
    lateinit var webTestClient: WebTestClient

    @Autowired
    lateinit var userService: UserService

    @Test
    fun shouldReturnUserById() {
        //given
        val user = User()
        user.id = "someId"
        user.username = "someUsername"
        userService.addUser(user).block()

        //when
        val resultUser = webTestClient.get()
                .uri("/users/" + user.id)
                .exchange()
                .expectStatus().isOk
                .returnResult(user.javaClass).responseBody.toMono().block()

        //then
        assertThat(resultUser).isEqualTo(user)
    }
}

@ComponentScan("org.webtree.mydata.api")
@AutoConfigureDataMongo
class Config

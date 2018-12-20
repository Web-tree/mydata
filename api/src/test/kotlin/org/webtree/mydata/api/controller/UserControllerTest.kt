package org.webtree.mydata.api.controller

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.*
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import org.webtree.mydata.api.boot.ControllerTestConfig
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.service.UserService
import reactor.core.publisher.toMono

@ExtendWith(SpringExtension::class)
@WebFluxTest(UserController::class)
@ContextConfiguration(classes = [ControllerTestConfig::class])
internal class UserControllerTest {
    @Autowired
    lateinit var webTestClient: WebTestClient

    @Autowired
    lateinit var userService: UserService

    @BeforeEach
    internal fun setUp() {
        webTestClient = webTestClient
                .mutateWith(mockUser())
    }

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


package org.webtree.mydata.controller

import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import org.webtree.mydata.controller.config.MongoTestConfig

@RunWith(SpringRunner::class)
@WebFluxTest(UserController::class)
@WithMockUser
@ContextConfiguration(classes = [MongoTestConfig::class])
internal class PersonalDataControllerTest {
    @Autowired
    lateinit var webTestClient: WebTestClient

    @Autowired
    lateinit var personalDataService: PersonalDataService

    @Test
    fun shouldReturnExistsUserData() {
        TODO()
    }

    @Test
    fun shouldReturnEmptyFluxIfNoData() {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    @Test
    fun shouldReturnDataWithTags() {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
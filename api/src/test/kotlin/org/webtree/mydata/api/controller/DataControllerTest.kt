package org.webtree.mydata.api.controller

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockUser
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters
import org.webtree.mydata.api.boot.ControllerTestConfig
import org.webtree.mydata.api.domain.data.TextData
import org.webtree.mydata.api.service.DataService
import reactor.core.publisher.toMono

@ExtendWith(SpringExtension::class)
@WebFluxTest(DataController::class)
@WithMockUser
@ContextConfiguration(classes = [ControllerTestConfig::class])
internal class DataControllerTest {
    @Autowired
    lateinit var webTestClient: WebTestClient

    @Autowired
    lateinit var dataService: DataService

    @BeforeEach
    internal fun setUp() {
        webTestClient = webTestClient
                .mutateWith(csrf())
                .mutateWith(mockUser())
    }

    @Nested
    inner class Text {
        private val dataValue = "some data"
        private lateinit var data: TextData
        private val uri = "/data/text"

        @BeforeEach
        internal fun setUp() {
            data = TextData(dataValue)
        }

        @Test
        fun shouldReturnId() {
            webTestClient
                    .post()
                    .uri(uri)
                    .body(BodyInserters.fromObject(data))
                    .exchange()
                    .expectStatus().isOk
                    .expectBody().jsonPath("id").isNotEmpty
        }

        @Test
        internal fun shouldBeAdded() {
            //when
            val dataFromApi = webTestClient
                    .post()
                    .uri(uri)
                    .body(BodyInserters.fromObject(data))
                    .exchange()
                    .expectStatus().isOk
                    .returnResult(TextData::class.java)
                    .responseBody.toMono().blockOptional().orElseThrow()

            // then
            val dataFromService = dataService.findBy(dataFromApi.id).blockOptional().orElseThrow()
            assertThat(dataFromService).isEqualTo(dataFromApi)
        }
    }
}
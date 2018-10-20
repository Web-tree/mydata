package org.webtree.mydata.api.service

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Answers
import org.mockito.BDDMockito.*
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import org.webtree.mydata.api.domain.data.Data
import org.webtree.mydata.api.repository.DataRepository
import reactor.core.publisher.Mono

@ExtendWith(MockitoExtension::class)
internal class DataServiceTest {
    @Mock(answer = Answers.RETURNS_MOCKS)
    lateinit var dataRepository: DataRepository

    private lateinit var dataService: DataService

    @BeforeEach
    fun setUp() {
        dataService = DataService(dataRepository)
    }

    @Nested
    inner class Find {
        @Mock
        lateinit var data: Mono<Data>

        @Test
        internal fun shouldReturnDataFromRepositoryById() {
            //given
            val id = "someId"
            given(dataRepository.findById(id)).willReturn(data)

            //when
            val data = dataService.findBy(id)

            //then
            assertThat(data).isEqualTo(data)
        }
    }

    @Nested
    inner class Save {
        lateinit var data: Data

        @BeforeEach
        internal fun setUp() {
            data = Mockito.mock(Data::class.java, Mockito.RETURNS_MOCKS)
        }

        @Test
        internal fun shouldSaveInRepository() {
            //when
            dataService.save(data)

            //then
            verify(dataRepository).save(data)
        }
    }
}
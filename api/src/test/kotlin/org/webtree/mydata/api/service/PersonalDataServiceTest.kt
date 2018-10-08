package org.webtree.mydata.api.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.webtree.mydata.api.domain.PersonalData
import org.webtree.mydata.api.repository.PersonalDataRepository
import reactor.core.publisher.Flux

@ExtendWith(MockitoExtension::class)
internal class PersonalDataServiceTest{
    @Mock
    lateinit var personalDataRepository: PersonalDataRepository
    @Mock
    lateinit var personalData: Flux<PersonalData>

    private lateinit var personalDataService: PersonalDataService

    @BeforeEach
    fun setUp() {
        personalDataService = PersonalDataService()
    }

    @Test
    fun shouldReturnDataFromRepository() {
        //given

        //        given(personalDataRepository.findById(id)).willReturn(personalData)

        //when

    }
}
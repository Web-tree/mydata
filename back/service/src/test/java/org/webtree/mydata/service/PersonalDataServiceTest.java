package org.webtree.mydata.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.webtree.mydata.domain.PersonalData;
import org.webtree.mydata.repository.PersonalDataRepository;
import reactor.core.publisher.Flux;

@ExtendWith(MockitoExtension.class)
class PersonalDataServiceTest {
    @Mock
    PersonalDataRepository personalDataRepository;
    @Mock
    Flux<PersonalData> personalData;

    PersonalDataService personalDataService;

    @BeforeEach
    void setUp() {
        personalDataService = new PersonalDataService();
    }

    @Test
    void shouldReturnDataFromRepository() {
        //given

//        given(personalDataRepository.findById(id)).willReturn(personalData)

        //when

    }
}
package org.webtree.mydata.api.service

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Answers
import org.mockito.Mock
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import org.webtree.mydata.api.domain.User
import org.webtree.mydata.api.repository.UserRepository

@ExtendWith(MockitoExtension::class)
internal class UserServiceTest {
    @Mock(answer = Answers.RETURNS_MOCKS)
    lateinit var userRepository: UserRepository
    lateinit var userService: UserService

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
    }

    @Test
    fun shouldReturnUserFromRepo() {
        //given
        val id = "someId"

        //when
        userService.findById(id)

        //then
        verify(userRepository).findById(id)
    }

    @Test
    fun shouldSaveUserInRepo() {
        //given
        val user = User()

        //when
        userService.addUser(user)

        //then
        verify(userRepository).save(user)
    }
}
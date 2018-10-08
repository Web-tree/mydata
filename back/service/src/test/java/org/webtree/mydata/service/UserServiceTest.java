package org.webtree.mydata.service;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.webtree.mydata.domain.User;
import org.webtree.mydata.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock(answer = Answers.RETURNS_MOCKS)
    UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository);
    }

    @Test
    void shouldReturnUserFromRepo() {
        //given
        var id = "someId";

        //when
        userService.findById(id);

        //then
        verify(userRepository).findById(id);
    }

    @Test
    void shouldSaveUserInRepo() {
        //given
        var user = new User();

        //when
        userService.addUser(user);

        //then
        verify(userRepository).save(user);
    }
}
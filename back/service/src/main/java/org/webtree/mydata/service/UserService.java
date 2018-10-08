package org.webtree.mydata.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webtree.mydata.domain.User;
import org.webtree.mydata.repository.UserRepository;
import reactor.core.publisher.Mono;

@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono findById(String id) {
        return userRepository.findById(id);
    }
    public final Mono addUser(User user) {
        return userRepository.save(user);
    }
}

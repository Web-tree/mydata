package org.webtree.mydata.service;

import org.springframework.stereotype.Service;
import org.webtree.mydata.domain.User;
import reactor.core.publisher.Flux;

import java.util.Set;

@Service
public class PersonalDataService {
    public Flux findBy(User user, Set tags) {
        throw new RuntimeException();
    }
}

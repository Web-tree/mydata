package org.webtree.mydata.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
@RequestMapping("/data")
class PersonalDataController {
    @GetMapping
    fun getData(): Flux<PersonalData> {
        TODO()
    }

}
package org.webtree.mydata.api.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.webtree.mydata.api.domain.data.Data
import org.webtree.mydata.api.domain.data.TextData
import org.webtree.mydata.api.service.DataService
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/data")
class DataController(
        @Autowired val dataService: DataService
) {
    @PostMapping("/text")
    fun addText(@RequestBody data: TextData): Mono<Data> {
        return dataService.save(data)
    }
}
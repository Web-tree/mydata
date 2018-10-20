package org.webtree.mydata.api.boot

import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo
import org.springframework.context.annotation.ComponentScan

@ComponentScan("org.webtree.mydata.api")
@AutoConfigureDataMongo
class ControllerTestConfig
module org.webtree.mydata.model {
    requires spring.context;
    requires java.validation;
    requires spring.data.mongodb;
    requires spring.data.commons.core;

    exports org.webtree.mydata.domain;
}
module org.webtree.mydata.service {
    requires org.webtree.mydata.model;
    requires org.webtree.mydata.repository;

    requires spring.context;
    requires reactor.core;
    requires spring.beans;

    exports org.webtree.mydata.service to org.webtree.mydata.web;
}
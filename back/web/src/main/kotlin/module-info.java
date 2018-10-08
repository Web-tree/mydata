module org.webtree.mydata.web {
    requires org.webtree.mydata.service;

    requires spring.web;
    requires reactor.core;
    requires spring.beans;
    requires org.webtree.mydata.model;
    requires spring.boot.autoconfigure;
    requires spring.boot;
}
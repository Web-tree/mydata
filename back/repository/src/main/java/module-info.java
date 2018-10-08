module org.webtree.mydata.repository {
    requires org.webtree.mydata.model;

    requires spring.data.mongodb;
    requires spring.context;

    exports org.webtree.mydata.repository to org.webtree.mydata.service;
}
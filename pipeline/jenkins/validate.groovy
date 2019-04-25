pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    def branch = env.CHANGE_BRANCH ? env.CHANGE_BRANCH : env.GIT_BRANCH
                    git branch: "${branch}", credentialsId: 'github-app', url: 'https://github.com/Web-tree/mydata.git'
                }
            }
        }
        stage('Validate') {
            parallel {
                stage('Verify api') {
                    environment {
                        MAVEN_HOME = '/usr/share/maven'
                    }
                    agent {
                        kubernetes {
                            label 'mystuff-validate-maven'
                            containerTemplate {
                                name 'maven-validate'
                                image 'maven:3.6.0-jdk-11-slim'
                                ttyEnabled true
                                command 'cat'
                            }
                        }
                    }
                    stages {
                        stage('Validate API') {
                            steps {
                                dir('api') {
                                    sh 'mvn -B clean verify -Dmaven.test.failure.ignore=true'
                                    junit '**/target/surefire-reports/**/*.xml'
                                }
                            }
                        }
                    }
                }
                stage('Verify web') {
                    agent {
                        kubernetes {
                            label 'mydata-validate-node'
                            containerTemplate {
                                name 'node-validate'
                                image 'webtree/node-with-chrome'
                                ttyEnabled true
                                command 'cat'
                            }
                        }
                    }
                    stages {
                        stage('Validate web') {
                            steps {
                                dir ('web/') {
                                    sh 'npm i'
                                    sh 'npm run test-headless'
                                    junit 'testResult/*.xml'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
pipeline {
    agent {
        label 'slave'
    }
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
                    agent {
                        docker {
                            image 'maven:3.6.0-jdk-11-slim'
                            args '-v jenkins_m2:/root/.m2'
                            reuseNode true
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
                        docker {
                            image 'webtree/node-with-chrome'
                            reuseNode true
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
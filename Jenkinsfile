pipeline {
    agent any

    tools {
        nodejs 'nodejs-22.0.0'
    }

    stages {
        // stage('MM-Alarm'){
        //     steps{
        //         script {
        //             def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
        //             def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
        //             mattermostSend (
        //                 color: '#D0E0E3',
        //                 icon: "https://jenkins.io/images/logos/jenkins/jenkins.png",
        //                 message: "파이프라인 시작: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
        //             )
        //         }
        //     }
        // }


        stage('Clone') {
            steps {
                echo '클론을 시작!'
                git branch: 'CICD', credentialsId: 'gitlab_credential', url: 'https://lab.ssafy.com/s10-final/S10P31D208.git'
                echo '클론을 완료!'
            }
        }

        stage('Add Env') {
            steps {
                echo '백엔드 환경 설정 💨'
                dir('./backend') {
                    withCredentials([file(credentialsId: 'backend_env', variable: 'env')]) {
                    sh 'cp ${env}  src/main/resources/env.yml'
                    }
                }
            }
        }

        stage('BE-Build') {
            steps {
                echo '백엔드 빌드 및 테스트 시작!'
                dir("./backend") {
                    sh "ls"
                    sh "chmod +x ./gradlew"

                    // sh "touch ./build.gradle"

                    // application properties 파일 복사
                    // sh "echo $BuildGradle > ./build.gradle"

                    sh "./gradlew clean build --exclude-task test"

                }
                echo '백엔드 빌드 및 테스트 완료!'
            }
        }

        stage('Build Back Docker Image') {
            steps {
                echo '백엔드 도커 이미지 빌드 시작!'
                dir("./backend") {
                    // 빌드된 JAR 파일을 Docker 이미지로 빌드
                    sh "docker build -t yunanash/backend:latest ."
                }
                echo '백엔드 도커 이미지 빌드 완료!'
            }
        }

        stage('Push to Docker Hub-BE') {
            steps {
                echo '백엔드 도커 이미지를 Docker Hub에 푸시 시작!'
                withCredentials([usernamePassword(credentialsId: 'docker_credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
                dir("./backend") {
                    sh "docker push yunanash/backend:latest"
                }
                echo '백엔드 도커 이미지를 Docker Hub에 푸시 완료!'
            }
        }

        stage('Deploy to EC2-BE') {
            steps {
                echo '백엔드 EC2에 배포 시작!'
                // 여기에서는 SSH 플러그인이나 SSH 스크립트를 사용하여 EC2로 연결하고 Docker 컨테이너 실행
                sshagent(['youngseogi']) {
                    sh "docker rm -f backend"
                    sh "docker rmi yunanash/backend:latest"
                    sh "docker image prune -f"
                    sh "docker pull yunanash/backend:latest && docker run -d -p 8000:8000 --name backend yunanash/backend:latest"
                }
                echo '백엔드 EC2에 배포 완료!'
            }
        }

        stage('FE-Build') {
            steps {
                echo '프론트 빌드 및 테스트 시작!'
                dir("./frontend") {
                    sh "npm install"
                    sh "npm run build"
                }
                echo '프론트 빌드 및 테스트 완료!'
            }
        }

        stage('Build Front Docker Image') {
            steps {
                echo '프론트 도커 이미지 빌드 시작!'
                dir("./frontend") {
                    // 빌드된 파일을 Docker 이미지로 빌드
                    sh "docker build -t yunanash/frontend:latest ."
                }
                echo '프론트 도커 이미지 빌드 완료!'
            }
        }

        stage('Push to Docker Hub-FE') {
            steps {
                echo '프론트 도커 이미지를 Docker Hub에 푸시 시작!'
                withCredentials([usernamePassword(credentialsId: 'docker_credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
                dir("frontend") {
                    sh "docker push yunanash/frontend:latest"
                }
                echo '프론트 도커 이미지를 Docker Hub에 푸시 완료!'
            }
        }

        stage('Deploy to EC2-FE') {
            steps {
                echo '프론트 EC2에 배포 시작!'
                // 여기에서는 SSH 플러그인이나 SSH 스크립트를 사용하여 EC2로 연결하고 Docker 컨테이너 실행
                sshagent(['youngseogi']) {
                    sh "docker rm -f frontend"
                    sh "docker rmi yunanash/frontend:latest"
                    sh "docker image prune -f"
                    sh "docker pull yunanash/frontend:latest && docker run -d -p 5173:5173 --name frontend yunanash/frontend:latest"
                }
                echo '프론트 EC2에 배포 완료!'
            }
        }

    }

    post {
        success {
            echo '파이프라인이 성공적으로 완료되었습니다!'
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                // mattermostSend (
                //     color: '#D0E0E3',
                //     icon: "https://jenkins.io/images/logos/jenkins/jenkins.png",
                //     message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
                // )
            }
        }
        failure {
            echo '파이프라인이 실패하였습니다. 에러를 확인하세요.'
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                // mattermostSend (
                //     color: '#D0E0E3',
                //     icon: "https://4.bp.blogspot.com/-52EtGjEhW-k/UtOBXa1fhVI/AAAAAAAABbU/Lk4ZBYcvZrY/s1600/download.jpeg",
                //     message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
                // )
            }
        }
    }
}                
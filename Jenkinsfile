pipeline {
    agent any

    environment {
        DOCKER_CREDS_ID = 'dockerhub-creds'
        IMAGE_NAME = 'renoacden/daily-task-planner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image... '
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing image to the Registry...'
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes Definitions...'
                // Apply static configs and services
                sh 'kubectl apply -f k8s/configmap.yaml'
                sh 'kubectl apply -f k8s/secrets.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                
                // Apply deployment. This applies the baseline configuration
                sh 'kubectl apply -f k8s/deployment.yaml'
                
                echo 'Updating Deployment Image to newly built version...'
                // Dynamically update the pod container to exactly the image we just pushed
                sh "kubectl set image deployment/daily-task-planner task-planner-container=${IMAGE_NAME}:${env.BUILD_NUMBER} --record=true"
                
                echo 'Verifying rollout status...'
                sh 'kubectl rollout status deployment/daily-task-planner'
            }
        }
    }
    
    post {
        always {
            // Clean up workspace after build to save memory
            cleanWs()
        }
        success {
            echo "✅ Pipeline successfully deployed the daily-task-planner application."
        }
        failure {
            echo "❌ Pipeline failed! Review the console logs."
        }
    }
}

pipeline {
    environment {
        registry = "linea/expviewer"
        registryCredential = 'Dockerhub'
        dockerImage = ''
        deployment = 'seadragon'
        namespace = 'expviewer'
    }
    agent any

    stages {
        stage('Test') {
            steps {
                sh 'yarn install'
                // sh 'yarn lint'
            }
        }
        stage('Building and push image') {
            when {
                allOf {
                    expression {
                        env.TAG_NAME == null
                    }
                    expression {
                        env.BRANCH_NAME.toString().equals('master')
                    }
                }
            }
            steps {
                script {
                sh 'docker build -t $registry:$GIT_COMMIT .'
                docker.withRegistry( '', registryCredential ) {
                    sh 'docker push $registry:$GIT_COMMIT'
                    sh 'docker rmi $registry:$GIT_COMMIT'
                }
                sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace -image $registry:$GIT_COMMIT -deployment $deployment\"}' \
                    https://fox.linea.gov.br/api/1/job/e79ea1f7-e156-4992-98b6-75995ac4c15a/executions
                  """
            }
        }
    }
  }
}
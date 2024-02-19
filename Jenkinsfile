pipeline {

  agent any;

  options {
	  buildDiscarder(logRotator(numToKeepStr: '20'))
	}

  environment {
		COMMIT_ID = ""
		SERVICE = "Mifos"
		SERVICE_NAME = "mifos"
		PREVIOUS_IMAGE = ""
    REGISTRY_URL = "10.66.166.18:8123"
    IMAGE = ""
    CODE_REPOSITORY = "http://10.66.154.26/core/mifos.git"
	}

  stages {

    stage('Continuos Integration (CI)') {
      steps {
        script {
          git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: CODE_REPOSITORY
          sh "git rev-parse --short HEAD > .git/commit_id"
          COMMIT_ID = readFile('.git/commit_id').trim()
          IMAGE = "${REGISTRY_URL}/${SERVICE_NAME}:${COMMIT_ID}"
          dir('prod'){
						git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url:'http://10.66.154.26/primes/primes-certs.git'
						sh "cp *.pem ../"
					}
					def previousCommit = env.GIT_PREVIOUS_COMMIT
					def shortPreviousCommit = previousCommit.substring(0, 7)
					PREVIOUS_IMAGE = "${REGISTRY_URL}/${SERVICE_NAME}:${shortPreviousCommit}"
        }
      }
    }

    stage('Building') {
      steps {
				script {
          dockerImage = docker.build "${IMAGE}"
				}
			}
    }

    stage('Publish') {
			steps {
				script {
					docker.withRegistry("http://10.66.166.18:8123", "inter-registry-user"){
						dockerImage.push()
					}
				}
			}
		}

    stage('Prune'){
			steps {
				script {
					sh "docker rmi ${dockerImage.id}"
				}
			}
		}

  }

}
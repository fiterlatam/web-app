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
    K8S_MANIFESTS_CODE_REPOSITORY = "http://10.66.154.26/core/kubernetes-manifests.git"
    CERTS_REPOSITORY = "http://10.66.154.26/primes/primes-certs.git"
    K8S_CLUSTER = ""
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
						git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: CERTS_REPOSITORY
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

    stage('Continuos Delivery (CI)') {
      steps {
        script {
          dir('kubernetes-manifests') {
            git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: K8S_MANIFESTS_CODE_REPOSITORY
            def lineToReplace = sh(script: "grep mifos mifos/deployment.frontend.yaml | awk '{print \$2}'", returnStdout: true).trim()
						sh "sed -i 's_${lineToReplace}_${IMAGE}_g' mifos/deployment.frontend.yaml"
            withCredentials([string(credentialsId: 'gitlab_jenkins_access_token', variable: 'SECRET')]) {
              sh "git add mifos/deployment.frontend.yaml"
              sh "git commit -m \"mifos/deployment.frontend.yaml file updated ${IMAGE} #1\""
              sh "git push http://amgoez:Angel%20Goez1@10.66.154.26/core/kubernetes-manifests.git main"
            }
          }

          dir('scripts') {
            sh "sudo chmod +x generate-playbook.sh"
            sh "sudo ./generate-playbook.sh ${K8S_CLUSTER}"
            sh "cp deploy-mifos-frontend-deployment-playbook.yaml /opt/playbooks/manager"
          }
        }
      }
    }

  }

}
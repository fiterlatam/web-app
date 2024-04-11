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
    COMPOSE_REPOSITORY = "http://10.66.154.26/core/compose.git"
    CERTS_REPOSITORY = "http://10.66.154.26/primes/primes-certs.git"
    PLAYBOOK_NAME = "deploy-core-mifos-playbook.yaml"
    PLAYBOOKS_LOCATION = "/opt/playbooks/manager"
    SLACK_MESSAGE_PREFIX = "[CORE-Mifos]: "
    DOCKER_COMPOSE_FILENAME = ""
    DOCKER_COMPOSE_SERVICE_NAME = ""
	}

  stages {

    stage('Continuos Integration (CI)') {
      steps {
        script {
          /* Validar que la rama sea env.BRANCH_NAME */
          git branch: env.BRANCH_NAME, credentialsId: 'jenkins_gitlab_integration', url: CODE_REPOSITORY
          sh "git rev-parse --short HEAD > .git/commit_id"
          COMMIT_ID = readFile('.git/commit_id').trim()
          IMAGE = "${REGISTRY_URL}/${SERVICE_NAME}:${COMMIT_ID}"
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Incio de integración Continua (CI) del servicio de Mifos para el commit ${COMMIT_ID}")
          dir('prod'){
						git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: CERTS_REPOSITORY
						sh "cp *.pem ../"
					}
					def previousCommit = env.GIT_PREVIOUS_COMMIT
					def shortPreviousCommit = previousCommit.substring(0, 7)
					PREVIOUS_IMAGE = "${REGISTRY_URL}/${SERVICE_NAME}:${shortPreviousCommit}"

          dir('scripts') {
            sh "sudo chmod +x get-docker-compose-service-name.sh"
            sh "sudo chmod +x get-docker-compose-file-name.sh"
            DOCKER_COMPOSE_SERVICE_NAME=sh(script: "./get-docker-compose-service-name.sh ${env.BRANCH_NAME}", returnStdout: true).trim()
            DOCKER_COMPOSE_FILENAME=sh(script: "./get-docker-compose-file-name.sh ${env.BRANCH_NAME}", returnStdout: true).trim()
          }
        }
      }
    }

    stage('Building') {
      steps {
				script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Incio de construcción de la imagen de Mifos para el commit ${COMMIT_ID}")
          dockerImage = docker.build "${IMAGE}"
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Construcción de la imagen de Mifos para el commit ${COMMIT_ID} finalizada con éxito")
				}
			}
    }
    
    stage('Publish') {
			steps {
				script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Incio de publicación de la imagen de Mifos para el commit ${COMMIT_ID}")
					docker.withRegistry("http://10.66.166.18:8123", "inter-registry-user"){
						dockerImage.push()
					}
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Publicación de la imagen de Mifos para el commit ${COMMIT_ID} finalizada con éxito")
				}
			}
		}

    stage('Prune'){
			steps {
				script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Depuración de la imagen de Mifos para el commit ${COMMIT_ID}")
					sh "docker rmi ${dockerImage.id}"
				}
			}
		}

    stage('Continuos Delivery (CI)') {
      steps {
        script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Incio del proceso de Entrega Continua (CD) de la imagen de Mifos para el commit ${COMMIT_ID}")
          
          dir('compose') {
            git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: COMPOSE_REPOSITORY
            def lineToReplace = sh(script: "grep mifos: ${DOCKER_COMPOSE_FILENAME} | awk '{print \$2}'", returnStdout: true).trim()
						sh "sed -i 's_${lineToReplace}_${IMAGE}_g' ${DOCKER_COMPOSE_FILENAME}"
            sh "cp ${DOCKER_COMPOSE_FILENAME} ../"
            
            if(env.BRANCH_NAME == 'main') {
              withCredentials([string(credentialsId: 'gitlab_jenkins_access_token', variable: 'SECRET')]) {
                sh "git add ${DOCKER_COMPOSE_FILENAME}"
                sh "git commit -m \" ${DOCKER_COMPOSE_FILENAME} file updated ${IMAGE} #1\""
                sh "git push http://amgoez:Angel%20Goez1@10.66.154.26/core/compose.git main"
              }
            }
          }

          dir('scripts') {
            sh "sudo chmod +x generate-playbook.sh"
            sh "sudo ./generate-playbook.sh ${PREVIOUS_IMAGE} ${PLAYBOOK_NAME} ${DOCKER_COMPOSE_FILENAME} ${DOCKER_COMPOSE_SERVICE_NAME}"
            sh "sudo cp ${PLAYBOOK_NAME} ${PLAYBOOKS_LOCATION}"
          }
          
          sh "sudo cp ${DOCKER_COMPOSE_FILENAME} ${PLAYBOOKS_LOCATION}"

          sshPublisher(
						publishers: [
							sshPublisherDesc(
								configName: 'Jenkins', transfers: [
									sshTransfer(
										cleanRemote: false, 
										execCommand: "ansible-playbook ${PLAYBOOKS_LOCATION}/${PLAYBOOK_NAME}", 
										execTimeout: 240000, 
									)
								], 
								usePromotionTimestamp: false, 
								useWorkspaceInPromotion: false, 
								verbose: false
							)
						]
					)

          slackSend(channel: "integrations-ci-cd", color: "good", message: "${SLACK_MESSAGE_PREFIX} Proceso de Entrega Continua (CD) de la imagen de Mifos para el commit ${COMMIT_ID} finalizado correctamente")
        }
      }
    }

  }

}

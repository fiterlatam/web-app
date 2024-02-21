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
	}

  stages {

    stage('Continuos Integration (CI)') {
      steps {
        script {
          git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: CODE_REPOSITORY
          sh "git rev-parse --short HEAD > .git/commit_id"
          COMMIT_ID = readFile('.git/commit_id').trim()
          IMAGE = "${REGISTRY_URL}/${SERVICE_NAME}:${COMMIT_ID}"
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Incio de integración Continua (CI) del servicio de Mifos para el commit ${COMMIT_ID}")
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
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Incio de construcción de la imagen de Mifos para el commit ${COMMIT_ID}")
          dockerImage = docker.build "${IMAGE}"
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Construcción de la imagen de Mifos para el commit ${COMMIT_ID} finalizada con éxito")
				}
			}
    }

    stage('Publish') {
			steps {
				script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Incio de publicación de la imagen de Mifos para el commit ${COMMIT_ID}")
					docker.withRegistry("http://10.66.166.18:8123", "inter-registry-user"){
						dockerImage.push()
					}
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Publicación de la imagen de Mifos para el commit ${COMMIT_ID} finalizada con éxito")
				}
			}
		}

    stage('Prune'){
			steps {
				script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Depuración de la imagen de Mifos para el commit ${COMMIT_ID}")
					sh "docker rmi ${dockerImage.id}"
				}
			}
		}

    stage('Continuos Delivery (CI)') {
      steps {
        script {
          slackSend(channel: "integrations-ci-cd", color: "good", message: "Incio del proceso de Entrega Continua (CD) de la imagen de Mifos para el commit ${COMMIT_ID}")

          dir('compose') {
            git branch: 'main', credentialsId: 'jenkins_gitlab_integration', url: COMPOSE_REPOSITORY
            def lineToReplace = sh(script: "grep mifos: docker-compose.yaml | awk '{print \$2}'", returnStdout: true).trim()
						sh "sed -i 's_${lineToReplace}_${IMAGE}_g' docker-compose.yaml"
            sh "cp docker-compose.yaml ../"
            withCredentials([string(credentialsId: 'gitlab_jenkins_access_token', variable: 'SECRET')]) {
              sh "git add docker-compose.yaml"
              sh "git commit -m \"docker-compose file updated ${IMAGE} #1\""
              sh "git push http://amgoez:Angel%20Goez1@10.66.154.26/core/compose.git main"
            }
          }

          dir('scripts') {
            sh "sudo chmod +x generate-playbook.sh"
            sh "sudo ./generate-playbook.sh ${PREVIOUS_IMAGE} ${PLAYBOOK_NAME}"
            sh "cp ${PLAYBOOK_NAME} ${PLAYBOOKS_LOCATION}"
          }

          sh "cp docker-compose.yaml ${PLAYBOOKS_LOCATION}"

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

          slackSend(channel: "integrations-ci-cd", color: "good", message: "Proceso de Entrega Continua (CD) de la imagen de Mifos para el commit ${COMMIT_ID} finalizado correctamente")
        }
      }
    }

  }

}
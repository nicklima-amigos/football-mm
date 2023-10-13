pipeline {
    agent any
    environment {
        TAG = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
    }
    stages {
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('SSH into Azure VM') {
            steps {
                script {
                    def azureSshKey = credentials('Azure SSH Private Key')
                    def sshPrivateKey = azureSshKey.content
                    def vmPublicIpAddress = 'IP_DA_SUA_MAQUINA_VIRTUAL'
                    def sshUsername = 'terraform'

                    sh """
                    ssh -i <<<EOF
                    $sshPrivateKey
                    EOF
                    $sshUsername@$vmPublicIpAddress
                    """
                }
            }
        }

        stage('install ansible playbooks') {
            steps {
                sh 'sudo apt update'
                sh 'sudo apt install software-properties-common'
                sh 'sudo apt-add-repository --yes --update ppa:ansible/ansible'
                sh 'sudo apt install ansible'
            }
        }
        stage('Run Ansible Playbook') {
            steps {
                script {
                    // Executar o playbook Ansible
                    sh "ansible-playbook /ansible/playbook.yml"
                }
            }
        }

        stage('build da imagem docker') {
            steps {
                sh 'docker build -t nicklimadev/footballmm:${TAG} .'
            }
        }

        stage('subir docker compose - postgres e app') {
            steps {
                sh 'docker-compose up --build -d'
            }
        }

        stage('sleep para subida de containers') {
            steps {
                sh 'sleep 10'
            }
        }

        stage('upload docker image'){
            steps {
                withDockerRegistry([credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/']) {
                    sh 'docker login -u ${env.DOCKERHUB_USERNAME} -p ${env.DOCKERHUB_PASSWORD}'
                    sh 'docker push nicklimadev/footballmm:${TAG}'
                }
            }
        }
    }
}  

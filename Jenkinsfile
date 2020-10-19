pipeline {
  agent {
    kubernetes {
      label "oatmeal-cookie"
      defaultContainer 'node'
      yaml """
apiVersion: v1
kind: Pod
spec:
  volumes:
  containers:
  - name: node
    image: node:lts-stretch
    command:
    - cat
    tty: true
    imagePullPolicy: IfNotPresent
    resources:
      limits:
        cpu: "1"
        memory: "8Gi"
      requests:
        cpu: "1"
        memory: "4Gi"
"""
    }
  }
  stages {
    stage("Checkout repo") {
      steps {
        checkout(scm)
      }
    }
    stage("Install dependencies") {
      steps {
        sh "yarn"
      }
    }
    stage("Analyze code") {
      parallel {
        stage('unit-tests') {
          steps {
            sh "yarn test"
          }
        }
      }
    }
    stage("Build") {
      parallel {
        stage("Build Package") {
          stages {
            stage("NPM publish") {
              when { branch 'master' }
              steps {
                withCredentials([file(credentialsId: 'npm-publish', variable: 'SecretFile')]) {
                  sh "cp $SecretFile ~/.npmrc"
                }
                sh "npm publish"
              }
            }
          }
        }
      }
    }
  }
}

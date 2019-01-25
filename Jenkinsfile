pipeline {
    agent none
    stages {
        stage('Lint') {
            agent { docker 'af560562826c' }
            steps {
                sh 'python3.6 -m venv venv'
                sh '. venv/bin/activate'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/pylint --load-plugins pylint_django TimeTracker/myapp/'
            }
         }
         stage('Test') {
            agent { docker 'af560562826c' }
            steps {
                sh 'python3.6 -m venv venv'
                sh '. venv/bin/activate'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/python3 TimeTracker/manage.py test TimeTracker/TimeTracker/tests'
            }
         }
         stage('Deploy') {
	    agent{ label 'master_node' }
            when {
                branch 'CHICO-766-deploy'
            }
            steps {
		sh 'whoami'
		sh 'docker-compose -f /home/ec2-user/TimeTracker/docker-compose.yml build --no-cache'
                sh 'docker-compose -f /home/ec2-user/TimeTracker/docker-compose.yml down'
                sh 'docker-compose -f /home/ec2-user/TimeTracker/docker-compose.yml up -d'
            }
         }
    }
}

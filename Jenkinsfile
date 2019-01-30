pipeline {
    agent none
    stages {
        stage('Lint') {
            agent { docker 'testing_environment:latest' }
            steps {
                sh 'python3.6 -m venv venv'
                sh '. venv/bin/activate'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/pylint --load-plugins pylint_django TimeTracker/myapp/'
            }
         }
         stage('Test') {
            agent { docker 'testing_environment:latest' }
            steps {
                sh 'python3.6 -m venv venv'
                sh '. venv/bin/activate'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/python3 TimeTracker/manage.py test myapp'
            }
         }
         stage('Deploy') {
	    agent{ label 'master_node' }
            when {
                branch 'master'
            }
            steps {
		sh 'sudo git -C /TimeTracker pull'
            }
         }
    }
}

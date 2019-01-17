#!groovy
node {
    try {
        stage 'Checkout'
          checkout scm
          sh 'git log HEAD^..HEAD --pretty="%h %an - %s" > GIT_CHANGES'
          def lastChanges = readFile('GIT_CHANGES')

        stage 'Lint'
            sh 'python3.6 -m venv venv'
            sh '. venv/bin/activate'
            sh 'venv/bin/pip install -r requirements.txt'
            sh 'venv/bin/pylint --load-plugins pylint_django TimeTracker/myapp/'

        stage 'Test'
            sh 'venv/bin/python3 TimeTracker/manage.py test TimeTracker/TimeTracker/tests'
    }

    catch (err) {
        throw err
    }
}

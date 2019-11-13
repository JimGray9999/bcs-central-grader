# bcs-central-grader


Draft design on moqups:

https://app.moqups.com/83pnXq1zws/view/page/aa9df7b72


Build out as a CLI with Inquirer first, then as a React app

Inquirer:
    Login
    Main Menu
        List of my Cohorts
            Show list of cohorts
            Select a cohort
                Current assignment
                List of all assignments

        Ungraded Assignments
        Refresh data (need to find a way to not need this step...)
        Exit

App:

Login (doing automatically for now, then allowing for input)

Dashboard
    View Cohorts assigned to you
        Need to filter out finished cohorts and cohorts you are a TA in
    See total number of grades open
        Sort by: Cohort, assignment, oldest/newest

Grades
    Sort by: Cohort, assignment, oldest/newest
    Highlight any with more than one comment (to help with tracking any changes made)
    List:
        Grade, Cohort, Student, Assignmemnt, Feedback, Date of Grade, Date of most recent feedback,
        feedback total

Next Steps
    Ability to grade from this app
    Pull in common comments to insert into the text field
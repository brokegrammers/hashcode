import fs, { read } from 'fs';

const inputs = [
    // 'a_an_example.in.txt',
    // 'b_better_start_small.in.txt',
    // 'c_collaboration.in.txt',
    // 'd_dense_schedule.in.txt',
    'e_exceptional_skills.in.txt',
    // 'f_find_great_mentors.in.txt'
]

const start = Date.now();
inputs.forEach((val, index) => {
    const data = fs.readFileSync('./input_data/' + val, { encoding: 'utf8', flag: 'r' }).trim().split('\n');
    const [numUsers, numProjects] = data[0].split(' ').map(el => parseInt(el));

    const users: { [x: string]: { numSkills: number, totalLevel: number, avg: number } } = {};
    const userSkills: { [x: string]: { occurence: number, totalLevel: number, avg: number } } = {};
    let lineIndex = 1;
    for (let user = 0; user < numUsers; user++) {
        const userLine = data[lineIndex++].split(' ');
        const userName = userLine[0];
        const numSkills = parseInt(userLine[1]);
        users[userName] = { numSkills: numSkills, totalLevel: 0, avg: 0 };
        for (let i = 0; i < numSkills; i++, ++lineIndex) {
            const skillLine = data[lineIndex].split(' ')
            const skill = skillLine[0];
            const level = parseInt(skillLine[1]);
            if (!userSkills[skill]) {
                userSkills[skill] = { occurence: 1, totalLevel: level, avg: 0 };
            } else {
                userSkills[skill].occurence++;
                userSkills[skill].totalLevel += level;
            };
            users[userName].totalLevel += level;
        }
        users[userName].avg = users[userName].totalLevel / numSkills;
    }
    Object.keys(userSkills).forEach(el => userSkills[el].avg = userSkills[el].totalLevel / userSkills[el].occurence);

    const projects: { [x: string]: { numSkills: number, totalLevel: number, skillAvg: number, score: number, duration: number, eval: number } } = {};
    const projectSkills: { [x: string]: { occurence: number, totalLevel: number, avg: number } } = {};
    for (let project = 0; project < numProjects; project++) {
        const projectLine = data[lineIndex++].split(' ');
        const projectName = projectLine[0];
        const duration = parseInt(projectLine[1]);
        const score = parseInt(projectLine[2]);
        const bestBefore = parseInt(projectLine[3]);
        const numSkills = parseInt(projectLine[4]);
        projects[projectName] = { numSkills: numSkills, totalLevel: 0, skillAvg: 0, score: score, duration: duration, eval: 0 };
        for (let i = 0; i < numSkills; i++, ++lineIndex) {
            const skillLine = data[lineIndex].split(' ')
            const skill = skillLine[0];
            const level = parseInt(skillLine[1]);
            if (!projectSkills[skill]) {
                projectSkills[skill] = { occurence: 1, totalLevel: level, avg: 0 };
            } else {
                projectSkills[skill].occurence++;
                projectSkills[skill].totalLevel += level;
            };
            projects[projectName].totalLevel += level;
        }
        projects[projectName].skillAvg = projects[projectName].totalLevel / numSkills;
        projects[projectName].eval = score / duration * projects[projectName].skillAvg;
    }
    Object.keys(projectSkills).forEach(el => {
        projectSkills[el].avg = projectSkills[el].totalLevel / projectSkills[el].occurence;
    });

    console.log('users:', users);
    console.log('sorted by avg [ASC]:', Object.keys(users).sort((a, b) => users[a].avg - users[b].avg));
    console.log();
    console.log('userSkills:', userSkills);
    console.log('sorted by avg [ASC]:', Object.keys(userSkills).sort((a, b) => userSkills[a].avg - userSkills[b].avg));
    console.log();
    console.log('projects:', projects);
    console.log('sorted by eval [ASC]:', Object.keys(projects).sort((a, b) => projects[a].eval - projects[b].eval));
    console.log();
    console.log('projectSkills:', projectSkills);
    console.log('sorted by avg [ASC]:', Object.keys(projectSkills).sort((a, b) => projectSkills[a].avg - projectSkills[b].avg));
})

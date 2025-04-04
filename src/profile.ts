interface ProjectTransaction {
    object: {
        name: string;
    };
    amount: number;
    createdAt: string;
}

interface Project {
    name: string;
    amount: number;
}

import { basicUserIdentification, xpAmount, userLevel, auditsRatio, userProjectXp } from './graphql.js';
import { createAuditRatioGraph, createProjectXPChart, createXPProgressGraph, formatFileSize } from './graphs.js';
import { createProfileTemplate } from './profileHtml.js';

async function createProfileUI() {
    if (!localStorage.getItem('jwt-token')) {
        return;
    }

    try {
        const [userResponse, xpResponse, levelResponse, auditResponse, projectResponse] = await Promise.all([
            basicUserIdentification(),
            xpAmount(),
            userLevel(),
            auditsRatio(),
            userProjectXp()
        ]);

        const user = userResponse.data.user[0];
        const attrs = user.attrs;
        const totalXP = xpResponse.data.transaction_aggregate.aggregate.sum.amount || 0;
        const currentLevel = levelResponse.data.transaction[0]?.amount || 0;
        const auditData = auditResponse.data.user[0];

        const profileContainer = document.createElement('div');
        profileContainer.className = 'container';
        profileContainer.classList.add('fade-in');

        profileContainer.innerHTML = createProfileTemplate(
            attrs,
            totalXP,
            currentLevel,
            auditData,
            formatFileSize
        );

        const graphContainer = profileContainer.querySelector('.graph-container') as HTMLElement;
        if (graphContainer) {
            const auditGraph = createAuditRatioGraph(auditData.auditRatio, 1);
            graphContainer.appendChild(auditGraph);
        }


        const projectGraphContainer = profileContainer.querySelector('.project-graph-container') as HTMLElement;
        if (projectGraphContainer) {
            const latestProjects = projectResponse.data.transaction
                .slice(-10)
                .map((proj: ProjectTransaction): Project => ({
                    name: proj.object.name,
                    amount: proj.amount
                }));

            const projectGraph = createProjectXPChart(latestProjects);
            projectGraphContainer.appendChild(projectGraph);
        }

        const progressGraphContainer = profileContainer.querySelector('.progress-graph-container') as HTMLElement;
        if (progressGraphContainer) {
            const progressGraph = createXPProgressGraph(projectResponse.data.transaction);
            progressGraphContainer.appendChild(progressGraph);
        }


        document.body.appendChild(profileContainer);
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}

createProfileUI();
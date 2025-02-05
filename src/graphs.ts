export function createAuditRatioGraph(totalUp: number, totalDown: number): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 100 100');
    
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const total = totalUp + totalDown;
    const ratio = totalUp / total;
    const offset = circumference * (1 - ratio);

    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '50');
    bgCircle.setAttribute('cy', '50');
    bgCircle.setAttribute('r', radius.toString());
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#ddd');
    bgCircle.setAttribute('stroke-width', '8');

    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '50');
    progressCircle.setAttribute('cy', '50');
    progressCircle.setAttribute('r', radius.toString());
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', '#4CAF50');
    progressCircle.setAttribute('stroke-width', '8');
    progressCircle.setAttribute('stroke-dasharray', circumference.toString());
    progressCircle.setAttribute('stroke-dashoffset', offset.toString());
    progressCircle.setAttribute('transform', 'rotate(-90 50 50)');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50');
    text.setAttribute('y', '50');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '16');
    text.textContent = `${Math.round(ratio * 100)}%`;

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);
    svg.appendChild(text);

    return svg;
}

export function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} kB`;
}

interface Project {
    name: string;
    amount: number;
}

export function createProjectXPChart(projects: Project[]): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '1800');  
    svg.setAttribute('height', '700'); 
    svg.setAttribute('viewBox', '0 0 1800 700');

    const padding = 80;  
    const chartWidth = 1600;  
    const chartHeight = 600;  

    const maxXP = Math.max(...projects.map(p => p.amount));
  
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding.toString());
    yAxis.setAttribute('y1', padding.toString());
    yAxis.setAttribute('x2', padding.toString());
    yAxis.setAttribute('y2', (chartHeight + padding).toString());
    yAxis.setAttribute('stroke', '#ffffff');
    yAxis.setAttribute('stroke-width', '2');

    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding.toString());
    xAxis.setAttribute('y1', (chartHeight + padding).toString());
    xAxis.setAttribute('x2', (chartWidth + padding).toString());
    xAxis.setAttribute('y2', (chartHeight + padding).toString());
    xAxis.setAttribute('stroke', '#ffffff');
    xAxis.setAttribute('stroke-width', '2');

    const yScaleSteps = 5;
    for (let i = 0; i <= yScaleSteps; i++) {
        const y = chartHeight + padding - (i * chartHeight / yScaleSteps);
        const value = (i * maxXP / yScaleSteps);
        
        const scaleMark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        scaleMark.setAttribute('x1', (padding - 5).toString());
        scaleMark.setAttribute('y1', y.toString());
        scaleMark.setAttribute('x2', padding.toString());
        scaleMark.setAttribute('y2', y.toString());
        scaleMark.setAttribute('stroke', '#ffffff');
        scaleMark.setAttribute('stroke-width', '2');

        const scaleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scaleLabel.setAttribute('x', (padding - 10).toString());
        scaleLabel.setAttribute('y', y.toString());
        scaleLabel.setAttribute('text-anchor', 'end');
        scaleLabel.setAttribute('alignment-baseline', 'middle');
        scaleLabel.setAttribute('fill', '#ffffff');
        scaleLabel.setAttribute('font-size', '14');
        scaleLabel.textContent = formatFileSize(value);

        svg.appendChild(scaleMark);
        svg.appendChild(scaleLabel);
    }

    svg.appendChild(xAxis);
    svg.appendChild(yAxis);

    projects.forEach((project, index) => {
        const barWidth = (chartWidth / projects.length) - 20; 
        const barHeight = (project.amount / maxXP) * chartHeight;
        const x = padding + (index * (chartWidth / projects.length));
        const y = chartHeight + padding - barHeight;

        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', x.toString());
        bar.setAttribute('y', y.toString());
        bar.setAttribute('width', barWidth.toString());
        bar.setAttribute('height', barHeight.toString());
        bar.setAttribute('fill', '#0ef');  
        bar.setAttribute('rx', '6');  
        bar.setAttribute('ry', '6');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (x + barWidth / 2).toString());
        text.setAttribute('y', (chartHeight + padding + 25).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('transform', `rotate(45, ${x + barWidth / 2}, ${chartHeight + padding + 25})`);
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '16');
        text.textContent = project.name;

        const xpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xpText.setAttribute('x', (x + barWidth / 2).toString());
        xpText.setAttribute('y', (y - 10).toString());
        xpText.setAttribute('text-anchor', 'middle');
        xpText.setAttribute('fill', '#ffffff');
        xpText.setAttribute('font-size', '14');
        xpText.textContent = formatFileSize(project.amount);

        svg.appendChild(bar);
        svg.appendChild(text);
        svg.appendChild(xpText);
    });

    return svg;
}

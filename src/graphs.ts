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
    if (bytes < 1000) {
        return `${bytes} B`;
    } else if (bytes < 1000 * 1000) {
        return `${(bytes / 1000).toFixed(2)} kB`;
    } else if (bytes < 1000 * 1000 * 1000) {
        return `${(bytes / (1000 * 1000)).toFixed(2)} MB`;
    } else {
        return `${(bytes / (1000 * 1000 * 1000)).toFixed(2)} GB`;
    }
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
        scaleLabel.setAttribute('x', (padding + 10).toString());
        scaleLabel.setAttribute('y', y.toString());
        scaleLabel.setAttribute('text-anchor', 'end');
        scaleLabel.setAttribute('alignment-baseline', 'middle');
        scaleLabel.setAttribute('fill', '#ffffff');


        scaleLabel.setAttribute('font-size', '20');
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

        bar.addEventListener('mouseover', () => {
            const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");

            const tspanElement = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspanElement.setAttribute("x", (x + barWidth / 2 + 10).toString());
            tspanElement.setAttribute("y", (y - 30).toString());
            tspanElement.textContent = project.name;
            tooltip.appendChild(tspanElement);

            tooltip.setAttribute("fill", "white");
            tooltip.setAttribute("font-size", "30");
            tooltip.setAttribute("class", "tooltip");

            const bbox = tooltip.getBBox();
            const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            background.setAttribute("x", (bbox.x - 5).toString());
            background.setAttribute("y", (bbox.y - 5).toString());
            background.setAttribute("width", (bbox.width + 10).toString());
            background.setAttribute("height", (bbox.height + 10).toString());
            background.setAttribute("fill", "rgba(0, 0, 0, 0.8)");
            background.setAttribute("rx", "4");
            background.setAttribute("class", "tooltip-bg");

            svg.appendChild(background);
            svg.appendChild(tooltip);
        });
        bar.addEventListener('mouseout', () => {
            const tooltip = svg.querySelector('.tooltip');
            const tooltipBg = svg.querySelector('.tooltip-bg');
            if (tooltip) svg.removeChild(tooltip);
            if (tooltipBg) svg.removeChild(tooltipBg);
        });

        const xpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xpText.setAttribute('x', (x + barWidth / 2).toString());
        xpText.setAttribute('y', (y - 10).toString());
        xpText.setAttribute('text-anchor', 'middle');
        xpText.setAttribute('fill', '#ffffff');
        xpText.setAttribute('font-size', '20');
        xpText.textContent = formatFileSize(project.amount);
        svg.appendChild(bar);

        svg.appendChild(xpText);
    });

    return svg;

} export function createXPProgressGraph(transactions: any[]) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 800 400");

    const dataPoints = transactions.map((t, index) => {
        const cumulativeXP = transactions
            .slice(0, index + 1)
            .reduce((sum, tx) => sum + tx.amount, 0);

        return {
            x: index,
            y: cumulativeXP,
            date: new Date(t.createdAt),
            name: t.object.name
        };
    });

    const maxXP = Math.max(...dataPoints.map(p => p.y));
    const points = dataPoints.map((p, i) => {
        const x = (i / (dataPoints.length - 1)) * 700 + 50;
        const y = 350 - (p.y / maxXP) * 300;
        return `${x},${y}`;
    }).join(" ");

    // Add Y-axis labels (XP values)
    for (let i = 0; i <= 5; i++) {
        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const yValue = Math.round((maxXP / 5) * i);
        yLabel.setAttribute("x", "10");
        yLabel.setAttribute("y", (350 - (i * 60)).toString());
        yLabel.setAttribute("fill", "white");
        yLabel.setAttribute("font-size", "12");
        yLabel.textContent = `${yValue}XP`;
        svg.appendChild(yLabel);
    }

    // Add X-axis labels (dates)
    const dateLabels = dataPoints.filter((_, i) => i % Math.ceil(dataPoints.length / 5) === 0);
    dateLabels.forEach((point, i) => {
        const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const x = (i * 700 / (dateLabels.length - 1)) + 50;
        xLabel.setAttribute("x", x.toString());
        xLabel.setAttribute("y", "370");
        xLabel.setAttribute("fill", "white");
        xLabel.setAttribute("font-size", "12");
        xLabel.setAttribute("text-anchor", "middle");
        xLabel.textContent = point.date.toLocaleDateString();
        svg.appendChild(xLabel);
    });

    // Rest of your existing graph code...
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${points}`);
    path.setAttribute("stroke", "#0ef");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");

    dataPoints.forEach((point, i) => {
        const x = (i / (dataPoints.length - 1)) * 700 + 50;
        const y = 350 - (point.y / maxXP) * 300;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#0ef");

        circle.addEventListener('mouseover', () => {
            const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const formattedXP = formatFileSize(point.y);
            const date = new Date(point.date).toLocaleDateString();

            // Create multiple lines for the tooltip
            const tooltipContent = [
                `Project: ${point.name}`,
                `XP: ${formattedXP}`,
                `Date: ${date}`
            ];

            tooltipContent.forEach((text, index) => {
                const tspanElement = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspanElement.setAttribute("x", (x + 10).toString());
                tspanElement.setAttribute("y", (y - 30 + (index * 20)).toString());
                tspanElement.textContent = text;
                tooltip.appendChild(tspanElement);
            });

            tooltip.setAttribute("fill", "white");
            tooltip.setAttribute("font-size", "12");
            tooltip.setAttribute("class", "tooltip");

            // Add background rectangle for better readability
            const bbox = tooltip.getBBox();
            const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            background.setAttribute("x", (bbox.x - 5).toString());
            background.setAttribute("y", (bbox.y - 5).toString());
            background.setAttribute("width", (bbox.width + 10).toString());
            background.setAttribute("height", (bbox.height + 10).toString());
            background.setAttribute("fill", "rgba(0, 0, 0, 0.8)");
            background.setAttribute("rx", "4");
            background.setAttribute("class", "tooltip-bg");

            svg.appendChild(background);
            svg.appendChild(tooltip);
        });

        circle.addEventListener('mouseout', () => {
            const tooltip = svg.querySelector('.tooltip');
            const tooltipBg = svg.querySelector('.tooltip-bg');
            if (tooltip) svg.removeChild(tooltip);
            if (tooltipBg) svg.removeChild(tooltipBg);
        });

        svg.appendChild(circle);
    });

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "50");
    xAxis.setAttribute("y1", "350");
    xAxis.setAttribute("x2", "750");
    xAxis.setAttribute("y2", "350");
    xAxis.setAttribute("stroke", "white");

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "50");
    yAxis.setAttribute("y1", "50");
    yAxis.setAttribute("x2", "50");
    yAxis.setAttribute("y2", "350");
    yAxis.setAttribute("stroke", "white");

    svg.appendChild(path);
    svg.appendChild(xAxis);
    svg.appendChild(yAxis);

    return svg;
}
document.addEventListener('DOMContentLoaded', function() {
    // --- Chart.js 구현 ---

    // 1. Papers per Year (Line Chart)
    const ctxTrend = document.getElementById('papersPerYearChart').getContext('2d');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['2023', '2024', '2025', '2026'],
            datasets: [{
                label: 'Papers',
                data: [2, 5, 4, 1],
                borderColor: '#2c3e50',
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2c3e50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Int'l vs Domestic (Bar Chart)
    const ctxQuality = document.getElementById('intlVsDomesticChart').getContext('2d');
    new Chart(ctxQuality, {
        type: 'bar',
        data: {
            labels: ['2023', '2024', '2025', '2026'],
            datasets: [
                {
                    label: 'International',
                    data: [0, 1, 2, 0],
                    backgroundColor: '#1a4a7c'
                },
                {
                    label: 'Domestic',
                    data: [2, 4, 2, 1],
                    backgroundColor: '#2a9d8f'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
                x: { stacked: true, grid: { display: false } }
            }
        }
    });

    // 3. Journal vs Conference (Doughnut Chart)
    const ctxStyle = document.getElementById('journalVsConferenceChart').getContext('2d');
    new Chart(ctxStyle, {
        type: 'doughnut',
        data: {
            labels: ['Journal', 'Conference'],
            datasets: [{
                data: [4, 8],
                backgroundColor: ['#1a4a7c', '#7fb3d5'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 4. Contribution per Year (Line Chart)
    const ctxContribYear = document.getElementById('contributionPerYearChart').getContext('2d');
    new Chart(ctxContribYear, {
        type: 'line',
        data: {
            labels: ['2023', '2024', '2025', '2026'],
            datasets: [{
                label: 'Contributions',
                data: [1, 2, 3, 1],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            }
        }
    });

    // 5. VVC vs VCM (Doughnut Chart)
    const ctxContribType = document.getElementById('contributionTypeChart').getContext('2d');
    new Chart(ctxContribType, {
        type: 'doughnut',
        data: {
            labels: ['VVC', 'VCM'],
            datasets: [{
                data: [4, 3],
                backgroundColor: ['#9b59b6', '#f39c12'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // --- D3.js Co-authorship Graph 구현 (역동적 설정) ---
    const width = document.getElementById('coAuthorshipGraph').clientWidth;
    const height = 600;

    const svg = d3.select("#coAuthorshipGraph")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    // JSON 데이터 로드 또는 인라인 데이터 사용
    let coauthorData = {
        nodes: [
            { id: "Hyoseung Shin", group: 1, role: "Me", color: "#e74c3c" },
            { id: "Kwang-deok Seo", group: 2, role: "Professor", color: "#2c3e50" },
            { id: "Min-suk Kim", group: 3, role: "Ph.D. Student", color: "#3498db" },
            { id: "Se-hee Park", group: 4, role: "MS Student", color: "#2ecc71" },
            { id: "Jun-kyung Ju", group: 4, role: "MS Student", color: "#2ecc71" },
            { id: "Tae-wook Kim", group: 4, role: "MS Student", color: "#2ecc71" },
            { id: "Gyu-min Park", group: 5, role: "Undergraduate", color: "#f39c12" },
            { id: "Ellen J.Hong", group: 2, role: "Professor", color: "#2c3e50" }
        ],
        links: [
            { source: "Hyoseung Shin", target: "Kwang-deok Seo", value: 5 },
            { source: "Hyoseung Shin", target: "Min-suk Kim", value: 3 },
            { source: "Hyoseung Shin", target: "Se-hee Park", value: 2 },
            { source: "Hyoseung Shin", target: "Jun-kyung Ju", value: 4 },
            { source: "Hyoseung Shin", target: "Tae-wook Kim", value: 4 },
            { source: "Hyoseung Shin", target: "Gyu-min Park", value: 3 },
            { source: "Hyoseung Shin", target: "Ellen J.Hong", value: 3 },
            { source: "Jun-kyung Ju", target: "Tae-wook Kim", value: 5 },
            { source: "Tae-wook Kim", target: "Gyu-min Park", value: 4 },
            { source: "Min-suk Kim", target: "Kwang-deok Seo", value: 5 }
        ]
    };

    const nodes = coauthorData.nodes;
    const links = coauthorData.links;

    // 역동적 물리 엔진 설정
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => 150 + d.value * 20))
        .force("charge", d3.forceManyBody().strength(-500).distanceMax(300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(30));

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value) * 2.5);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => d.id === "Hyoseung Shin" ? 14 : 9)
        .attr("fill", d => d.color)
        .call(drag(simulation));

    node.append("title").text(d => `${d.id} (${d.role})`);

    const labels = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.id)
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("dx", 15)
        .attr("dy", 4)
        .attr("pointer-events", "none");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.5).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // --- 동적 슬라이더 컨트롤 ---
    const repulsionRange = document.getElementById('repulsionRange');
    const gravityRange = document.getElementById('gravityRange');
    const edgeRange = document.getElementById('edgeRange');

    // 슬라이더 범위 설정
    repulsionRange.setAttribute('min', '100');
    repulsionRange.setAttribute('max', '1000');
    repulsionRange.setAttribute('value', '500');

    gravityRange.setAttribute('min', '0');
    gravityRange.setAttribute('max', '1');
    gravityRange.setAttribute('step', '0.01');
    gravityRange.setAttribute('value', '0.1');

    edgeRange.setAttribute('min', '50');
    edgeRange.setAttribute('max', '500');
    edgeRange.setAttribute('value', '200');

    repulsionRange.addEventListener('input', (e) => {
        const value = -parseInt(e.target.value);
        simulation.force("charge", d3.forceManyBody().strength(value).distanceMax(300));
        simulation.alpha(0.3).restart();
    });

    gravityRange.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        simulation.force("center", d3.forceCenter(width / 2, height / 2).strength(value));
        simulation.alpha(0.3).restart();
    });

    edgeRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        simulation.force("link", d3.forceLink(links).id(d => d.id).distance(d => value + d.value * 20));
        simulation.alpha(0.3).restart();
    });

    // Reset Button
    document.getElementById('resetGraphBtn').addEventListener('click', () => {
        repulsionRange.value = '500';
        gravityRange.value = '0.1';
        edgeRange.value = '200';
        
        simulation.force("charge", d3.forceManyBody().strength(-500).distanceMax(300));
        simulation.force("center", d3.forceCenter(width / 2, height / 2).strength(0.1));
        simulation.force("link", d3.forceLink(links).id(d => d.id).distance(d => 200 + d.value * 20));
        simulation.alpha(1).restart();
    });

    // 역할 필터 체크박스
    const roleCheckboxes = document.querySelectorAll('.role-filters input[type="checkbox"]');
    roleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            simulation.alpha(0.3).restart();
        });
    });
});

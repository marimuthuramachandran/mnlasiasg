document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('evImpactChart');
  const ctx = canvas.getContext('2d');

  const blueGlow = ctx.createLinearGradient(0, 0, 0, 400);
  blueGlow.addColorStop(0, '#00ffe0');
  blueGlow.addColorStop(1, '#006eff');

  const greenGlow = ctx.createLinearGradient(0, 0, 0, 400);
  greenGlow.addColorStop(0, '#aaffcc');
  greenGlow.addColorStop(1, '#00cc66');

  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Energy Dispensed (MWh)', 'CO₂ Offset (Tons)'],
      datasets: [{
        label: 'Impact',
        data: [0, 0],
        backgroundColor: [blueGlow, greenGlow],
        borderRadius: 16,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      animation: false, // disable default animation, we handle it manually
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: '#ffffff',
          font: { weight: 'bold', size: 16 },
          formatter: value => value.toFixed(0)
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#00ffcc',
          bodyColor: '#e5e7eb',
          borderColor: '#00ffcc',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 250,
          ticks: { color: '#9ca3af', font: { size: 14 } },
          grid: { color: '#2d2d2d' }
        },
        x: {
          ticks: { color: '#d1d5db', font: { size: 14, weight: '500' } },
          grid: { display: false }
        }
      }
    },
    plugins: [ChartDataLabels]
  };

  const chart = new Chart(ctx, chartConfig);

  const targetEnergy = 200;
  const targetCO2 = 80;
  let currentEnergy = 0;
  let currentCO2 = 0;
  let animationFrameId = null;

  function animateChart() {
    if (currentEnergy < targetEnergy) currentEnergy += Math.random() * 4;
    if (currentCO2 < targetCO2) currentCO2 += Math.random() * 1.5;

    chart.data.datasets[0].data = [
      Math.min(currentEnergy, targetEnergy),
      Math.min(currentCO2, targetCO2)
    ];
    chart.update('none'); // update without animation to keep it smooth

    if (currentEnergy < targetEnergy || currentCO2 < targetCO2) {
      animationFrameId = requestAnimationFrame(animateChart);
    }
  }

  function resetChart() {
    currentEnergy = 0;
    currentCO2 = 0;
    if(animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    chart.data.datasets[0].data = [0, 0];
    chart.update();
  }

  // Intersection Observer to trigger animation when section visible
  const section = document.getElementById('ev-impact');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start animation only if not already animating
        if (!animationFrameId) animateChart();
      } else {
        // Reset chart when scrolled out of view
        resetChart();
      }
    });
  }, {
    threshold: 0.5 // trigger when 50% visible
  });

  observer.observe(section);
});

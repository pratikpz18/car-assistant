let ctx = document.getElementById('myChart').getContext('2d'); // 2d context

let movingAverageDuration = 7;
let yRealValuesTwoWeeks = [43, 53, 45.5, 41, 42, 49, 36, 71, 39, 44, 55, 49.9, 55, 56];
let yRealValuesOneWeek = [71, 39, 44, 55, 49.9, 55, 56];

let days = [1, 2, 3, 4, 5, 6, 7];

let yMovingAverageValuesOneWeek = [];
let sum = 0;
for (let i = 0; i < movingAverageDuration; i++) {
    sum += yRealValuesTwoWeeks[i];
}
for (let i = movingAverageDuration; i < yRealValuesTwoWeeks.length; i++) {
    sum += yRealValuesTwoWeeks[i];
    sum -= yRealValuesTwoWeeks[i - movingAverageDuration];
    yMovingAverageValuesOneWeek.push(sum / movingAverageDuration);
    console.log(sum / movingAverageDuration);
}

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: days,
        datasets: [{
                label: 'Real values',
                data: yRealValuesOneWeek,
                fill: false,
                borderColor: 'blue',
                tension: 0.1
            },
            {
                label: `Moving Average ${movingAverageDuration} Days`,
                data: yMovingAverageValuesOneWeek,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1.5,
                tension: 0.1
            }
        ]
    }
})
 


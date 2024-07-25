import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n.jsx';

Chart.register(...registerables);

const LineChart = ({ transactions, filterDate, nativeParams, translate }) => {
  function parseYYYYMMDD(dateString) {
    const year = parseInt(dateString.substr(0, 4), 10);
    const month = parseInt(dateString.substr(4, 2), 10) - 1;
    const day = parseInt(dateString.substr(6, 2), 10);

    return new Date(year, month, day);
  }

  function parseYYYYMM(dateString) {
    const year = parseInt(dateString.substr(0, 4), 10);
    const month = parseInt(dateString.substr(4, 2), 10) - 1;
    const day = 1;

    return new Date(year, month, day);
  }

  function getDayOfWeek(date) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = date.getDay();

    return daysOfWeek[dayIndex];
  }

  function getDayAndMonth(date) {
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];

    return `${month} ${day} `;
  }

  function getMonthOfYear(date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    return month;
  }

  const monthFullNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const transactionDate = [];
  transactions?.elData?.trx_statistics?.forEach(function (obj) {
    if (filterDate === 'weekly') {
      transactionDate.push(getDayOfWeek(parseYYYYMMDD(obj.trx_dt)));
    }
    if (filterDate === 'monthly') {
      transactionDate.push(getDayAndMonth(parseYYYYMMDD(obj.trx_dt)));
    }
    if (filterDate === 'yearly') {
      transactionDate.push(getMonthOfYear(parseYYYYMM(obj.trx_dt)));
    }
  });

  const transactionDateTooltip = [];

  transactions?.elData?.trx_statistics?.forEach(function (obj) {
    if (transactionDate.length === 12) {
      transactionDateTooltip.push(getFullMonthName(parseYYYYMM(obj.trx_dt).getMonth()));
    } else if (transactionDate.length === 7 || transactionDate.length === 30) transactionDateTooltip.push(getDayAndMonth(parseYYYYMMDD(obj.trx_dt)));
  });
  function getFullMonthName(month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return monthNames[month];
  }

  const transactionCount = [];
  transactions?.elData?.trx_statistics?.forEach(function (obj) {
    transactionCount.push(obj.trx_cnt);
  });
  const transactionData = [];
  transactions?.elData?.trx_statistics?.forEach(function (obj) {
    transactionData.push(obj.all_samt);
  });

  const [chartData, setChartData] = useState({
    labels: transactionDate,
    datasets: [
      {
        data: transactionData,
        fillColor: 'black',
        borderColor: '#3270EA',
        borderWidth: 3,
        pointRadius: 0,
        pointBorderColor: '#2C3B4E',
        pointBackgroundColor: '#ffffff',
        fill: true,
        backgroundColor: context => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(148, 14.5, 156.845, 144.398);
          gradient.addColorStop(0, 'rgba(30, 89, 207, 0.4)');
          gradient.addColorStop(1, 'rgba(79, 139, 244, 0.1)');
          return gradient;
        }
      }
    ]
  });
  const chartRef = useRef(null);

  useEffect(() => {
    const updatedChartData = {
      labels: transactionDate,
      datasets: [
        {
          data: transactionData,
          fillColor: 'black',
          borderColor: '#3270EA',
          borderWidth: 3,
          pointRadius: 0, // Show data points
          pointHoverBorderWidth: 3,
          pointHoverBorderColor: '#2C3B4E',
          pointHoverBackgroundColor: '#ffffff',
          fill: true,
          backgroundColor: context => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(148, 14.5, 156.845, 144.398);
            gradient.addColorStop(0, 'rgba(30, 89, 207, 0.4)');
            gradient.addColorStop(1, 'rgba(79, 139, 244, 0.1)');
            return gradient;
          }
        }
      ]
    };
    setChartData(updatedChartData);
  }, [transactions]);
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const lastLabelIndex = transactionDate.length - 1;
      const meta = chart.getDatasetMeta(0);
      const activeElement = meta.data[lastLabelIndex];

      if (activeElement) {
        const tooltip = chart.tooltip;
        if (tooltip) {
          tooltip.setActiveElements([{ datasetIndex: 0, index: lastLabelIndex }]);
          chart.update();
          chart.tooltip.update();
        }
      }
    }
  }, [transactions, filterDate, nativeParams, transactionDate]);

  // let activePointX = null;
  // let activePointY = null;

  // Chart.register({
  //   id: 'hoverline',
  //   afterDatasetDraw: function (chart, easing) {
  //     if (chart.tooltip?._active && chart.tooltip._active.length) {
  //       const activePoint = chart.tooltip._active[0];
  //       const ctx = chart.ctx;
  //       if (activePoint) {
  //         activePointX = activePoint.element.x;
  //         activePointY = activePoint.element.y;

  //         const topY = chart.scales.y.top;
  //         const bottomY = chart.scales.y.bottom;
  //         ctx.save();
  //         ctx.beginPath();
  //         ctx.setLineDash([3, 1]);
  //         ctx.moveTo(activePointX, activePointY + 3);
  //         ctx.lineTo(activePointX, bottomY);
  //         ctx.lineWidth = 1;
  //         ctx.strokeStyle = 'black';
  //         ctx.stroke();
  //         ctx.restore();

  //         // Adding a circle on top of the vertical line
  //         const radius = 5;
  //         ctx.save();
  //         ctx.beginPath();
  //         ctx.arc(activePointX, activePointY, radius, 0, 2 * Math.PI);
  //         ctx.fillStyle = 'white';
  //         ctx.fill();
  //         ctx.lineWidth = 2;
  //         ctx.strokeStyle = 'black';
  //         ctx.stroke();
  //         ctx.restore();
  //       }
  //     } else if (activePointX && activePointY) {
  //       const ctx = chart.ctx;
  //       const topY = chart.scales.y.top;
  //       const bottomY = chart.scales.y.bottom;
  //       ctx.save();
  //       ctx.beginPath();
  //       ctx.setLineDash([3, 1]);
  //       ctx.moveTo(activePointX, activePointY + 3);
  //       ctx.lineTo(activePointX, bottomY);
  //       ctx.lineWidth = 1;
  //       ctx.strokeStyle = 'black';
  //       ctx.stroke();
  //       ctx.restore();

  //       // Adding a circle on top of the vertical line
  //       const radius = 5;
  //       ctx.save();
  //       ctx.beginPath();
  //       ctx.arc(activePointX, activePointY, radius, 0, 2 * Math.PI);
  //       ctx.fillStyle = 'white';
  //       ctx.fill();
  //       ctx.lineWidth = 2;
  //       ctx.strokeStyle = 'black';
  //       ctx.stroke();
  //       ctx.restore();
  //     }
  //   }
  // });
  Chart.register({
    id: 'hoverline',
    afterDatasetDraw: function (chart, easing) {
      if (chart.tooltip?._active && chart.tooltip._active.length) {
        const activePoint = chart.tooltip._active[0];
        const ctx = chart.ctx;
        if (activePoint) {
          const x = activePoint.element.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([3, 1]);
          ctx.moveTo(x, activePoint.element.y + 3);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'black';
          ctx.stroke();
          ctx.restore();

          // Adding a circle on top of the vertical line
          const radius = 5;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, activePoint.element.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'black';
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  });

  const maxDataValue = Math.max(...chartData.datasets[0].data);
  function maximumNum(amountMax) {
    let count = 0;
    let temp = amountMax;

    while (temp >= 10) {
      temp /= 10;
      count++;
    }

    temp = temp > 5 ? 10 : 5;

    return temp * Math.pow(10, count);
  }
  const maxChartValue = maximumNum(maxDataValue);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: { enabled: false },
    hover: { mode: null },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    layout: {
      padding: {
        right: 20,
        left: 10
      }
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          color: '#A0A2A7',
          padding: 4,
          autoSkip: false,
          maxRotation: 0,
          callback: function (value, index, values) {
            if (
              index === 0 ||
              index === values.length - 1 ||
              (index % 4 === 0 && values.length === 12) ||
              (index % 10 === 0 && values.length === 30) ||
              values.length === 7
            ) {
              return this.getLabelForValue(value);
            }
            return '';
          }
        },
        grid: {
          drawBorder: false,
          display: false
        }
      },
      y: {
        max: maxChartValue,
        min: 0,
        ticks: {
          padding: 12,
          stepSize: maxChartValue / 5,
          color: '#A0A2A7',
          callback: function (value, index, ticks) {
            if (value >= 1e6) {
              return value / 1e6 + 'm';
            } else if (value >= 1e3) {
              return value / 1e3 + 'k';
            }
            return value.toString();
          }
        },
        border: {
          dash: [3, 2],
          color: 'rgba(0, 0, 0, 0)'
        },
        grid: {
          drawBorder: false,
          lineWidth: function (context) {
            return context?.index === 0 ? 0 : 1;
          }
        },
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            let label = '0';
            if (context[0].parsed.y) {
              if (context[0].parsed.y >= 1e6) {
                label = (context[0].parsed.y / 1e6).toFixed(1) + 'm';
              } else if (context[0].parsed.y >= 1e3) {
                label = (context[0].parsed.y / 1e3).toFixed(1) + 'k';
              } else label = context[0].parsed.y.toFixed(1);
            }
            if (nativeParams.mcht_ac_ccy_c === 'USD') {
              label = '$' + label;
            } else if (nativeParams.mcht_ac_ccy_c === 'KHR') {
              label = '៛' + label;
            }
            return label;
          },
          label: function (context) {
            let label1 = '';
            let label2 = '';

            const dataIndex = context.dataIndex;
            if (dataIndex < transactionCount.length) {
              label1 = transactionCount[dataIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              label1 = `(${label1} Trx)`;
            }
            if (dataIndex < transactionCount.length) {
              label2 = `${transactionDateTooltip[dataIndex]}`;
            }

            return [label1, label2];
          }
        },
        backgroundColor: '#FFF',
        titleColor: 'black',
        bodyColor: 'black',
        displayColors: false,
        borderWidth: '5px',
        borderColor: 'black',
        bodyAlign: 'center',
        titleAlign: 'center'
      }
    }
  };

  return (
    <>
      <div style={{ height: '27vh' }}>
        <div
          style={{
            // fontFamily: 'SF Pro',
            fontSize: '1.5vh',
            fontWeight: '400',
            lineHeight: '2vh',
            letterSpacing: '0px',
            textAlign: 'right',
            paddingRight: '24px',
            color: '#A0A2A7'
          }}
        >
          Unit {nativeParams?.mcht_ac_ccy_c || 'Unkn.'}
          {/* {nativeParams?.account_ac_ccy_c === 'USD' ? translate('lbl_com_3005') : translate('lbl_com_3076') || 'USD'} */}
        </div>
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            ...options,
            interaction: {
              mode: 'index',
              intersect: false
            }
          }}
        />
      </div>
    </>
  );
};

export default withHTMLParseI18n(LineChart);

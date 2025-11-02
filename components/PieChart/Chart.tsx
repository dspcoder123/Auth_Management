import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./Chart.css";

const chartOptions: ApexOptions = {
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
    foreColor: '#fff',
    background: 'transparent'
  },
  labels: [
    "Financial Overhead",
    "Bonus & Found",
    "Infrastructure",
    "Gift Code Inventory"
  ],
  legend: { show: false },
  dataLabels: {
    style: { colors: ['#fff'] }
  },
  colors: [
    "#2464e9", "#4683ec", "#a7c2fb", "#e3e9fc"
  ],
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
      }
    }
  }
};

const chartSeries = [39.2, 29.6, 20.4, 10.8];

export default function TokenSaleSection() {
  return (
    <section className="token-sale-section">
      <div className="token-sale-section__container">
        <div className="token-sale-section__chart">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="340"
          />
        </div>
        <div className="token-sale-section__info">
          <span className="token-sale-section__subtitle">TOKEN</span>
          <h2 className="token-sale-section__title">Token Sale</h2>
          <p className="token-sale-section__desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus condimentum tellus at lectus pulvinar, id auctor felis iaculis. In vestibulum neque sem, at dapibus justo facilisis in.
          </p>
          <ul className="token-sale-section__list">
            <li><span className="dot dot1" /> 73% Financial Overhead</li>
            <li><span className="dot dot2" /> 55% Bonus & found</li>
            <li><span className="dot dot3" /> 38% it infastructure</li>
            <li><span className="dot dot4" /> 20.93% Gift Code Inventory</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

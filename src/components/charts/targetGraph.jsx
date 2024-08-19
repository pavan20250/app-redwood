import React from 'react';
import GaugeChart from 'react-gauge-chart';

const FundSpeedometers = () => {
    // Data for Fund Sanctioned
    const fundSanctionedTarget = 800; // Target value in million rupees
    const fundSanctionedValue = 552; // Value in million rupees

    // Data for Fund Dispersed
    const fundDispersedTarget = 552; // Target value in million rupees
    const fundDispersedValue = 204.7; // Value in million rupees

    // Calculate percentage for each
    const fundSanctionedPercentage = fundSanctionedValue / fundSanctionedTarget;
    const fundDispersedPercentage = fundDispersedValue / fundDispersedTarget;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <style>
                {`
                h3, h5 {
                    color: #34495e;
                }
                `}
            </style>
            <div style={{ width: '260px', textAlign: 'center' }}>
                <h3>Fund Sanctioned</h3>
                <div style={{ marginBottom: '10px' }}>
                    <h5>Target: {fundSanctionedTarget}M</h5>
                    <h5>Actual: {fundSanctionedValue}M</h5>
                </div>
                <GaugeChart id="fundSanctionedChart"
                            nrOfLevels={30}
                            percent={fundSanctionedPercentage}
                            textColor="#000"
                            arcPadding={0.02}
                            animate={true}
                            needleColor="#000"
                            hideText={true} // Hide the percentage indicator
                />
            </div>
            <div style={{ width: '260px', textAlign: 'center' }}>
                <h3>Fund Dispersed</h3>
                <div style={{ marginBottom: '10px' }}>
                    <h5>Target: {fundDispersedTarget}M</h5>
                    <h5>Actual: {fundDispersedValue}M</h5>
                </div>
                <GaugeChart id="fundDispersedChart"
                            nrOfLevels={30}
                            percent={fundDispersedPercentage}
                            textColor="#000"
                            arcPadding={0.02}
                            animate={true}
                            needleColor="#000"
                            hideText={true} // Hide the percentage indicator
                />
            </div>
        </div>
    );
};

export default FundSpeedometers;

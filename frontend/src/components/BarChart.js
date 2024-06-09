import React, { useEffect, useRef, useState } from 'react';
import {Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const BarChart = () => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [data, setData] = useState({
        campaigns: [],
        offers: [],
        clicks: [],
        leads: [],
    });
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campaignsResponse, offersResponse, clicksResponse, leadsResponse] = await Promise.all([
                    fetch('http://localhost:8000/api/campaigns/'),
                    fetch('http://localhost:8000/api/offers/'),
                    fetch('http://localhost:8000/api/clicks/'),
                    fetch('http://localhost:8000/api/leads/'),
                ]);

                const campaigns = await campaignsResponse.json();
                const offers = await offersResponse.json();
                const clicks = await clicksResponse.json();
                const leads = await leadsResponse.json();

                setData({campaigns, offers, clicks, leads});
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        }, []);

    useEffect(() => {
        if (data.campaigns.length > 0) {
            const myChartRef = chartRef.current.getContext('2d');

            if (chartInstance) {
                chartInstance.destroy();
        }

            const filteredCampaigns = filter ? data.campaigns.filter(campaign =>
                campaign.name.includes(filter)) : data.campaigns;

            let sortedCampaigns = [...filteredCampaigns];
            if (sort) {
                sortedCampaigns.sort((a, b) => {
                    if (sort === 'name') {
                        return a.name.localeCompare(b.name);
                    }
                    if (sort === 'clicks') {
                        const aClicks = data.clicks.filter(click =>
                        data.offers.filter(offer => offer.campaign === a.id).map(offer =>
                        offer.id).includes(click.offer)).length;
                        const bClicks = data.clicks.filter(click =>
                        data.offers.filter(offer => offer.campaign === b.id).map(offer =>
                        offer.id).includes(click.offer)).length;
                        return bClicks - aClicks;
                    }
                    return 0;
                });
            }

            const campaignNames = sortedCampaigns.map(campaign => campaign.name);
            const campaignOfferCounts = sortedCampaigns.map(campaign =>
                data.offers.filter(offer => offer.campaign === campaign.id).length
            );

            const campaignClickCounts = sortedCampaigns.map(campaign => {
            const campaignOfferIds = data.offers.filter(offer => offer.campaign === campaign.id).map(offer => offer.id);
            return data.clicks.filter(click => campaignOfferIds.includes(click.offer)).length;
            });

            const campaignLeadCounts = sortedCampaigns.map(campaign => {
            const campaignOfferIds = data.offers.filter(offer => offer.campaign === campaign.id).map(offer => offer.id);
            const campaignClickIds = data.clicks.filter(click => campaignOfferIds.includes(click.offer)).map(click => click.id);
            return data.leads.filter(lead => campaignClickIds.includes(lead.click)).length;
            });

            const campaignRevenue = sortedCampaigns.map(campaign => {
                const campaignOfferIds = data.offers.filter(offer => offer.campaign === campaign.id).map(offer => offer.id);
                const revenuePerLead = 100;
                const campaignClickIds = data.clicks.filter(click => campaignOfferIds.includes(click.offer)).map(click => click.id);
                const campaignLeadCount = data.leads.filter(lead => campaignClickIds.includes(lead.click)).length;
                return campaignLeadCount * revenuePerLead
            });

            const campaignEPC = sortedCampaigns.map((campaign, index) => {
                return campaignClickCounts[index] > 0 ?
                    parseFloat(campaignRevenue[index] / campaignClickCounts[index].toFixed(2)) : 0;
            });

            const newChartInstance = new
            Chart(myChartRef, {
                type: 'bar',
                data: {
                    labels: campaignNames,
                    datasets: [
                        {
                            label: 'Offer Counts',
                            data: campaignOfferCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Click Counts',
                            data: campaignClickCounts,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Lead Counts',
                            data: campaignLeadCounts,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Revenue',
                            data: campaignRevenue,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'EPC ($)',
                            data: campaignEPC,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                        }
                        ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const datasetLabel = context.dataset.label || '';
                                    let value = context.raw;
                                    if (datasetLabel === 'EPC ($)') {
                                        value = `$${value}`;
                                    }
                                    return `${datasetLabel}: $ {value}`;
                                }
                            }
                        }
                    },
                    scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Campaigns',
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Counts / Revenue / EPC ($)',
                        font: {
                            size: 16
                        }
                    }
                }
                    }
                    },
            });

            setChartInstance(newChartInstance);
        }
        }, [data, filter, sort]);
    return (
        <div>
            <div style={{ marginBottom: '20px'}}>
                <input type="text"
                       placeholder="Filter by campaign name"
                       value={filter}
                       onChange={e => setFilter(e.target.value)}
                       style={{ marginRight: '10px', padding: '5px'}}
                />

                <select value={sort} onChange={e => setSort(e.target.value)}
                style={{padding: '5px'}}>
                    <option value="">Sort By</option>
                    <option value="name">Name</option>
                    <option value="clicks">Clicks</option>
                </select>
            </div>

        <canvas id="myBarChart"
                ref={chartRef}/>
            </div>
    );
};

export default BarChart;
